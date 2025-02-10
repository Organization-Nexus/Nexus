import { PartialType } from '@nestjs/mapped-types';
import { CreateMinutesDto } from './create-minutes.dto';

export class UpdateMinutesDto extends PartialType(CreateMinutesDto) {}
