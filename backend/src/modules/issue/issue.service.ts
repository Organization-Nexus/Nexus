import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';

import { ProjectUser } from '../project-user/entites/project-user.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import {
  NotFoundIssueException,
  UnauthorizedIssueException,
} from './exception/issue.exception';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
  ) {}

  async createIssue(
    createIssueDto: CreateIssueDto,
    author: ProjectUser,
    milestoneId: number,
  ) {
    const issue = this.issueRepository.create({
      ...createIssueDto,
      author: author,
      milestone: { id: milestoneId },
    });

    const savedIssue = await this.issueRepository.save(issue);
    return this.getIssueDetail(savedIssue.id);
  }

  async getIssueList(milestoneId: number) {
    return await this.issueRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['author.user.log'],
      order: { createdAt: 'DESC' },
    });
  }

  async getIssueDetail(issueId: number) {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
      relations: ['author.user.log', 'milestone'],
    });

    if (!issue) {
      throw new NotFoundIssueException(issueId);
    }

    return issue;
  }

  async updateIssue(updateIssueDto: UpdateIssueDto, issueId: number) {
    const issue = await this.getIssueDetail(issueId);
    const updatedIssue = Object.assign(issue, updateIssueDto);
    return await this.issueRepository.save(updatedIssue);
  }

  async deleteIssue(issueId: number) {
    const issue = await this.findIssueEntity(issueId);
    await this.issueRepository.remove(issue);
  }

  async validateIssueAuthor(issueId: number, projectUserId: number) {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
      relations: ['author', 'milestone.author'],
    });
    // PM은 수정,삭제 가능
    const isPM = issue.milestone.author.is_sub_admin;

    console.log(issue);
    if (!issue) {
      throw new NotFoundIssueException(issueId);
    }

    if (!isPM && issue.author.id !== projectUserId) {
      throw new UnauthorizedIssueException(projectUserId);
    }
  }

  private async findIssueEntity(issueId: number) {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
      relations: ['author', 'author.user'],
    });

    if (!issue) {
      throw new NotFoundIssueException(issueId);
    }

    return issue;
  }
}
