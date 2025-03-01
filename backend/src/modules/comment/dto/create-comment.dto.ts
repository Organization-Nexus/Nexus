import { IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(100)
  content: string;

  @IsOptional()
  feedId?: number;

  @IsOptional()
  voteId?: number;

  @IsOptional()
  @IsInt()
  parentCommentId?: number;
}
