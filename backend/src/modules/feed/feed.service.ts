// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Feed } from './entites/feed.entity';
// import { Repository } from 'typeorm';
// import { CreateFeedDto } from './dto/create-feed.dto';

// @Injectable()
// export class FeedService {
//   constructor(
//     @InjectRepository(Feed)
//     private readonly feedRepository: Repository<Feed>,
//   ) {}

//   async createFeed(createFeedDto: CreateFeedDto, userId: number) {
//     console.log('✅ createFeedDto', createFeedDto);
//     const feed = this.feedRepository.create({
//       ...createFeedDto,
//       projectUser: { id: userId },
//     });
//     console.log('✅ feed', feed);
//     await this.feedRepository.save(feed);
//     return feed;
//   }
//   async upadateFeed(feedId: number) {}
// }
