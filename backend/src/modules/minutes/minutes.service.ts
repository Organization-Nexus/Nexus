import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  NotFoundMinutesException,
  UnauthorizedMinutesException,
} from './exception/minutes-exception';
import { Minutes } from './entities/minutes.entity';
import { MinutesParticipant } from './entities/minutes-participant.entity';
import { CreateMinutesDto } from './dto/create-minutes.dto';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { UpdateMinutesDto } from './dto/update-minutes.dto';

@Injectable()
export class MinutesService {
  constructor(
    @InjectRepository(Minutes)
    private minutesRepository: Repository<Minutes>,
    @InjectRepository(MinutesParticipant)
    private participantRepository: Repository<MinutesParticipant>,
  ) {}

  async createMinutes(
    createMinutesDto: CreateMinutesDto,
    author: ProjectUser,
    projectId: number,
  ) {
    const minutes = this.minutesRepository.create({
      ...createMinutesDto,
      author: author,
      project: { id: projectId },
    });

    const savedMinutes = await this.minutesRepository.save(minutes);

    // 참석자 정보 저장
    const participants = createMinutesDto.participant_ids.map((memberId) => {
      return this.participantRepository.create({
        minutes: savedMinutes,
        member: { id: memberId },
      });
    });

    await this.participantRepository.save(participants);

    return this.getMinutesDetail(savedMinutes.id);
  }

  async getMinutesList(projectId: number) {
    return await this.minutesRepository.find({
      where: { project: { id: projectId } },
      relations: ['author', 'participants', 'participants.member'],
      order: { created_at: 'DESC' },
    });
  }

  async getMinutesDetail(minutesId: number) {
    const minutes = await this.minutesRepository.findOne({
      where: { id: minutesId },
      relations: ['author', 'participants', 'participants.member'],
    });

    if (!minutes) {
      throw new NotFoundMinutesException(minutesId);
    }

    return minutes;
  }

  async updateMinutes(updateMinutesDto: UpdateMinutesDto, minutesId: number) {
    const minutes = await this.getMinutesDetail(minutesId);

    // 기본 정보 업데이트
    Object.assign(minutes, updateMinutesDto);
    await this.minutesRepository.save(minutes);

    // 참석자 정보 업데이트
    if (updateMinutesDto.participant_ids) {
      await this.participantRepository.delete({ minutes: { id: minutesId } });

      const newParticipants = updateMinutesDto.participant_ids.map(
        (memberId) => {
          return this.participantRepository.create({
            minutes: { id: minutesId },
            member: { id: memberId },
          });
        },
      );

      await this.participantRepository.save(newParticipants);
    }

    return this.getMinutesDetail(minutesId);
  }

  async deleteMinutes(minutesId: number) {
    const minutes = await this.getMinutesDetail(minutesId);

    // 2. 참석자 정보 먼저 삭제
    await this.participantRepository.delete({
      minutes: { id: minutesId },
    });

    await this.minutesRepository.remove(minutes);
  }

  async validateMinutesAuthor(minutesId: number, projectUserId: number) {
    const minutes = await this.minutesRepository.findOne({
      where: { id: minutesId },
      relations: ['author'],
    });

    if (!minutes) {
      throw new NotFoundMinutesException(minutesId);
    }

    if (minutes.author.id !== projectUserId) {
      throw new UnauthorizedMinutesException(projectUserId);
    }
  }
}
