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
import { MinutesResponseDto } from './dto/minutes.dto';

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
      relations: [
        'author.user',
        // 'participants',
        // 'participants.member',
        // 'participants.member.user',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getMinutesDetail(minutesId: number) {
    const minutes = await this.minutesRepository.findOne({
      where: { id: minutesId },
      relations: [
        'author.user.log',
        // 'participants',
        // 'participants.member',
        // 'participants.member.user',
        'participants.member.user.log',
      ],
    });

    if (!minutes) {
      throw new NotFoundMinutesException(minutesId);
    }

    return this.toMinutesResponseDto(minutes);
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
    const minutes = await this.findMinutesEntity(minutesId);
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

  private toMinutesResponseDto(minutes: Minutes): MinutesResponseDto {
    return {
      id: minutes.id,
      title: minutes.title,
      meeting_date: minutes.meeting_date,
      meeting_time: minutes.meeting_time,
      agenda: minutes.agenda,
      topic: minutes.topic,
      content: minutes.content,
      decisions: minutes.decisions,
      notes: minutes.notes,
      author: {
        id: minutes.author.id,
        user: {
          name: minutes.author.user.name,
          position: minutes.author.position,
          log: {
            profileImage: minutes.author.user.log?.profileImage,
          },
        },
      },
      participants: minutes.participants.map((participant) => ({
        id: participant.id,
        member: {
          id: participant.member.id,
          user: {
            name: participant.member.user.name,
            log: {
              profileImage: participant.member.user.log?.profileImage,
            },
          },
        },
      })),
    };
  }

  // 엔티티 조회용 private 메서드
  private async findMinutesEntity(minutesId: number) {
    const minutes = await this.minutesRepository.findOne({
      where: { id: minutesId },
      relations: ['author', 'author.user', 'participants'],
    });

    if (!minutes) {
      throw new NotFoundMinutesException(minutesId);
    }

    return minutes;
  }
}
