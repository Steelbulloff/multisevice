import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkStat } from './entities/stat.entity';
import { DaysInfo } from './entities/days-info.entity';
import { Links } from './entities/links.entity';
import { LinksService } from './links.service';
import { LinksController, RedirectController } from './links.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LinkStat, DaysInfo, Links])],
  providers: [LinksService],
  controllers: [LinksController, RedirectController],
  exports: [LinksService],
})
export class LinksModule {}
