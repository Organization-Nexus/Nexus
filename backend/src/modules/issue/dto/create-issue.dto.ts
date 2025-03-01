import { IsString, Length, IsIn } from 'class-validator';

export class CreateIssueDto {
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
  @IsIn(['FE', 'BE'])
  category: string;

  @IsString()
  @IsIn(['feature', 'api', 'refactor', 'bug', 'setting', 'test'])
  label: string;
}
