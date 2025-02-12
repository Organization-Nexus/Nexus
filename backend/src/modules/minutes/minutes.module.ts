import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minutes } from './entities/minutes.entity';
import { MinutesParticipant } from './entities/minutes-participant.entity';
import { MinutesService } from './minutes.service';
import { MinutesController } from './minutes.controller';
import { ProjectUserModule } from 'src/modules/project-user/project-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Minutes, MinutesParticipant]),
    ProjectUserModule,
  ],
  controllers: [MinutesController],
  providers: [MinutesService],
  exports: [MinutesService],
})
export class MinutesModule {}
