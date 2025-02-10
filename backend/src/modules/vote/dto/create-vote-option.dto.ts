import { IsString } from 'class-validator';

export class CreateVoteOptionDto {
  @IsString()
  content: string;
}
