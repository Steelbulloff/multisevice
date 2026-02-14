import { IsOptional, IsArray, IsString } from 'class-validator';

export class GetLinkDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dateList?: string[];
}
