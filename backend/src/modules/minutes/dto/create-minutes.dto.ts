import {
  IsString,
  IsArray,
  IsOptional,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateMinutesDto {
  @IsString()
  @Length(1, 50)
  title: string;

  @IsString()
  meeting_date: string;

  @IsString()
  meeting_time: string;

  @IsString()
  @Length(1, 100)
  agenda: string;

  @IsString()
  @Length(1, 255)
  topic: string;

  @IsString()
  @Length(1, 3000)
  content: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  decisions?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  notes?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  participant_ids: number[];
}
