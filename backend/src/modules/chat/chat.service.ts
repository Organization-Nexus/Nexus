import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';
import { ChatParticipant, ChatRole } from './entities/chat-participant.entity';
import { Message } from './entities/chat-message.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatParticipant)
    private chatParticipantRepository: Repository<ChatParticipant>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 사용자가 채팅할 수 있는 모든 사용자 목록 조회 (같은 프로젝트 멤버들)
  async getAvailableChatUsers(userId: number) {
    // 사용자가 속한 모든 프로젝트 ID 조회
    const userProjects = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });

    if (userProjects.length === 0) {
      return [];
    }

    const projectIds = userProjects.map((up) => up.project.id);

    // 해당 프로젝트에 속한 모든 사용자 조회
    const projectMembers = await this.projectUserRepository.find({
      where: {
        project: { id: In(projectIds) },
        user: { id: Not(userId) }, // 자기 자신은 제외
      },
      relations: ['user'],
    });

    // 중복 제거 (한 사용자가 여러 프로젝트에 속할 수 있음)
    const uniqueUsers = new Map();
    projectMembers.forEach((member) => {
      if (!uniqueUsers.has(member.user.id)) {
        uniqueUsers.set(member.user.id, member.user);
      }
    });

    return Array.from(uniqueUsers.values());
  }

  // 1:1 채팅방 생성 또는 기존 채팅방 조회
  async createOrGetPersonalChat(user1Id: number, user2Id: number) {
    // 이미 존재하는 1:1 채팅방 확인
    const existingChatRoom = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .innerJoin('chatRoom.participants', 'participant1')
      .innerJoin('chatRoom.participants', 'participant2')
      .where('chatRoom.type = :type', { type: ChatRoomType.PERSONAL })
      .andWhere('participant1.userId = :user1Id', { user1Id })
      .andWhere('participant2.userId = :user2Id', { user2Id })
      .getOne();

    if (existingChatRoom) {
      return existingChatRoom;
    }

    // 새 채팅방 생성
    const chatRoom = this.chatRoomRepository.create({
      type: ChatRoomType.PERSONAL,
    });

    const savedChatRoom = await this.chatRoomRepository.save(chatRoom);

    // 참여자 추가 - 각각 개별적으로 생성하고 저장
    const participant1 = this.chatParticipantRepository.create({
      userId: user1Id,
      chatRoomId: savedChatRoom.id,
      role: ChatRole.MEMBER,
    });

    const participant2 = this.chatParticipantRepository.create({
      userId: user2Id,
      chatRoomId: savedChatRoom.id,
      role: ChatRole.MEMBER,
    });

    await this.chatParticipantRepository.save(participant1);
    await this.chatParticipantRepository.save(participant2);

    return savedChatRoom;
  }

  // 프로젝트 기반 그룹 채팅방 생성
  async createProjectGroupChat(
    projectId: number,
    title: string,
    creatorId: number,
    memberIds: number[],
  ) {
    // 프로젝트 존재 여부 및 사용자가 프로젝트에 속하는지 확인
    const projectUser = await this.projectUserRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: creatorId },
      },
    });

    if (!projectUser) {
      throw new Error('User is not a member of this project');
    }

    // 모든 멤버가 해당 프로젝트에 속하는지 확인
    const projectMembers = await this.projectUserRepository.find({
      where: {
        project: { id: projectId },
        user: { id: In(memberIds) },
      },
    });

    if (projectMembers.length !== memberIds.length) {
      throw new Error('Some users are not members of this project');
    }

    // 채팅방 생성
    const chatRoom = this.chatRoomRepository.create({
      type: ChatRoomType.GROUP,
      title,
      projectId,
    });

    const savedChatRoom = await this.chatRoomRepository.save(chatRoom);

    // 참여자 추가 (생성자는 ADMIN, 나머지는 MEMBER)
    const participants = memberIds.map((userId) => ({
      userId,
      chatRoomId: savedChatRoom.id,
      role: userId === creatorId ? ChatRole.ADMIN : ChatRole.MEMBER,
    }));

    await this.chatParticipantRepository.save(participants);

    return savedChatRoom;
  }

  // 사용자의 모든 채팅방 조회
  async getUserChatRooms(userId: number) {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .innerJoin('chatRoom.participants', 'participant')
      .leftJoinAndSelect('chatRoom.participants', 'allParticipants')
      .leftJoinAndSelect('allParticipants.user', 'participantUser')
      .leftJoinAndSelect('chatRoom.project', 'project')
      .where('participant.userId = :userId', { userId })
      .getMany();
  }

  // 메시지 전송
  async sendMessage(chatRoomId: number, senderId: number, content: string) {
    // 사용자가 채팅방 참여자인지 확인
    const participant = await this.chatParticipantRepository.findOne({
      where: {
        chatRoomId,
        userId: senderId,
      },
      relations: ['user', 'user.log'],
    });

    if (!participant) {
      throw new Error('User is not a participant of this chat room');
    }

    const message = this.messageRepository.create({
      content,
      senderId,
      chatRoomId,
      readBy: [senderId], // 보낸 사람은 이미 읽음 처리
      sender: {
        id: participant.user.id,
        name: participant.user.name,
        log: {
          profileImage: participant.user.log.profileImage,
          status: participant.user.log.status,
        },
      },
    });

    return this.messageRepository.save(message);
  }

  // 채팅방 메시지 조회
  async getChatRoomMessages(chatRoomId: number, userId: number) {
    // 사용자가 채팅방 참여자인지 확인
    const participant = await this.chatParticipantRepository.findOne({
      where: {
        chatRoomId,
        userId,
      },
    });

    if (!participant) {
      throw new Error('User is not a participant of this chat room');
    }

    return this.messageRepository.find({
      where: { chatRoomId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  // 사용자가 속한 프로젝트 목록 조회
  async getUserProjects(userId: number) {
    const projectUsers = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });

    return projectUsers.map((pu) => pu.project);
  }

  // 프로젝트 멤버 목록 조회
  async getProjectMembers(projectId: number) {
    const projectUsers = await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user'],
    });

    return projectUsers.map((pu) => pu.user);
  }
}
