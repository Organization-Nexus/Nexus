import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { MilestoneParticipant } from './entities/milestone-participant.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

import { MilestoneResponseDto } from './dto/milestone-response.dto';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import {
  NotFoundMilestoneException,
  UnauthorizedMilestoneException,
} from './exception/milestone.exception';
import { UpdateMilestoneDto } from './dto/update-milestone';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    @InjectRepository(MilestoneParticipant)
    private participantRepository: Repository<MilestoneParticipant>,
  ) {}

  async createMilestone(
    createMilestoneDto: CreateMilestoneDto,
    author: ProjectUser,
    projectId: number,
  ) {
    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      author: author,
      project: { id: projectId },
    });

    const savedMilestone = await this.milestoneRepository.save(milestone);

    const participants = createMilestoneDto.participant_ids.map((memberId) => {
      return this.participantRepository.create({
        milestone: savedMilestone,
        member: { id: memberId },
      });
    });
    console.log(participants);

    await this.participantRepository.save(participants);

    return this.getMilestoneDetail(savedMilestone.id);
  }

  async getMilestoneList(projectId: number) {
    return await this.milestoneRepository.find({
      where: { project: { id: projectId } },
      relations: ['author.user.log', 'participants.member.user.log'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMilestoneDetail(milestoneId: number) {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['author.user.log', 'participants.member.user.log'],
    });

    if (!milestone) {
      throw new NotFoundMilestoneException(milestoneId);
    }

    return this.toMilestoneResponseDto(milestone);
  }

  async getMyMilestones(projectId: number, projectUserId: number) {
    const milestones = await this.milestoneRepository.find({
      where: {
        project: { id: projectId },
        author: { id: projectUserId },
      },
      relations: ['author.user.log', 'participants.member.user.log'],
      order: { createdAt: 'DESC' },
    });

    return milestones.map((milestone) =>
      this.toMilestoneResponseDto(milestone),
    );
  }

  async updateMilestone(
    updateMilestoneDto: UpdateMilestoneDto,
    milestoneId: number,
  ) {
    const milestone = await this.getMilestoneDetail(milestoneId);

    // 기본 정보 업데이트
    Object.assign(milestone, updateMilestoneDto);
    await this.milestoneRepository.save(milestone);

    // 참여자 정보 업데이트
    if (updateMilestoneDto.participant_ids) {
      await this.participantRepository.delete({
        milestone: { id: milestoneId },
      });

      const newParticipants = updateMilestoneDto.participant_ids.map(
        (memberId) => {
          return this.participantRepository.create({
            milestone: { id: milestoneId },
            member: { id: memberId },
          });
        },
      );

      await this.participantRepository.save(newParticipants);
    }

    return this.getMilestoneDetail(milestoneId);
  }

  async deleteMilestone(milestoneId: number) {
    const milestone = await this.findMilestoneEntity(milestoneId);
    await this.participantRepository.delete({
      milestone: { id: milestoneId },
    });
    await this.milestoneRepository.remove(milestone);
  }

  async validateMilestoneAuthor(milestoneId: number, projectUserId: number) {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['author'],
    });

    if (!milestone) {
      throw new NotFoundMilestoneException(milestoneId);
    }

    if (milestone.author.id !== projectUserId) {
      throw new UnauthorizedMilestoneException(projectUserId);
    }
  }

  private toMilestoneResponseDto(milestone: Milestone): MilestoneResponseDto {
    return {
      id: milestone.id,
      title: milestone.title,
      start_date: milestone.start_date,
      end_date: milestone.end_date,
      content: milestone.content,
      goal: milestone.goal,
      note: milestone.note,
      category: milestone.category,
      author: {
        id: milestone.author.id,
        user: {
          name: milestone.author.user.name,
          position: milestone.author.position,
          log: {
            profileImage: milestone.author.user.log?.profileImage,
          },
        },
      },
      participants: milestone.participants.map((participant) => ({
        id: participant.id,
        member: {
          id: participant.member.id,
          user: {
            name: participant.member.user.name,
            position: participant.member.position,
            log: {
              profileImage: participant.member.user.log?.profileImage,
            },
          },
        },
      })),
    };
  }

  private async findMilestoneEntity(milestoneId: number) {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['author', 'author.user', 'participants'],
    });
    if (!milestone) {
      throw new NotFoundMilestoneException(milestoneId);
    }
    return milestone;
  }

  async getMilestonesByProjectId(
    projectId: number,
    projectUserIds: number[],
  ): Promise<Milestone[]> {
    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split('T')[0]);
    return this.milestoneRepository.find({
      where: {
        project: { id: projectId },
        participants: { member: { id: In(projectUserIds) } },
        start_date: LessThan(todayDateOnly),
        end_date: MoreThan(todayDateOnly),
      },
      relations: ['participants', 'participants.member'],
      order: { end_date: 'ASC' },
    });
  }
}
