import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksController, RedirectController } from './links.controller';
import { LinksService } from './links.service';
import {
  DaysInfo,
  Links,
  LinksDomainRegion,
  LinksTags,
  LinkStat,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinkStat,
      DaysInfo,
      Links,
      LinksDomainRegion,
      LinksTags,
    ]),
  ],
  providers: [LinksService],
  controllers: [LinksController, RedirectController],
  exports: [LinksService],
})
export class LinksModule {}
