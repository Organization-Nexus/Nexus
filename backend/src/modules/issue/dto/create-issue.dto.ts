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
  @Length(1, 1000)
  expected_results: string;

  @IsString()
  @IsIn(['FE', 'BE'])
  category: string;

  @IsString()
  @IsIn(['feature', 'refactor', 'bug', 'setting', 'test'])
  label: string;

  @IsString()
  @Length(1, 50)
  branch: string;
}
