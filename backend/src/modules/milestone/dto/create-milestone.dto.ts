import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  @IsString()
  @Length(1, 2000)
  content: string;

  @IsString()
  @Length(1, 1000)
  goal: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  note?: string;

  @IsString()
  // @IsIn(['FE', 'BE'])
  category: string;

  @IsArray()
  @IsNumber({}, { each: true })
  participant_ids: number[];
}
