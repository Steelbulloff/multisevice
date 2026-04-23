import { IsOptional, IsArray, IsString } from 'class-validator';

export class GetLinkDto {
  @IsOptional()
  dateList?: string[];
  domainId?: number;
}
