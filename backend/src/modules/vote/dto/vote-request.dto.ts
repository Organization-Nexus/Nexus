import { IsArray, ArrayNotEmpty } from 'class-validator';

export class VoteRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  optionId: number[];
}
