import { IsArray } from 'class-validator';

export class VoteRequestDto {
  @IsArray()
  optionId: number[];
}
