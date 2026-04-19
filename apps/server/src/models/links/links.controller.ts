import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { LinksService } from './links.service';
import { CreateLinkDto, CreateTagDto, DeleteLinksDto, GetLinkDto } from './dto';
import type { Request, Response } from 'express';
import { Public } from 'src/core';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createLink(@Body() params: CreateLinkDto, @Req() req: any) {
    return this.linksService.createLink(params, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getLinks(@Req() req: any) {
    return this.linksService.getLinks(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getLinkInfo(
    @Param('id') id: number,
    @Req() req: any,
    @Query() query: GetLinkDto,
  ) {
    return this.linksService.getLinkInfo(Number(id), req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  removeLinks(@Body() params: DeleteLinksDto, @Req() req: any) {
    return this.linksService.removeLinks(params, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-tag')
  createTag(@Body() params: CreateTagDto, @Req() req: any) {
    return this.linksService.createTag(params, req.user.userId);
  }
}

@Controller()
export class RedirectController {
  constructor(private readonly linksService: LinksService) {}
  @Public()
  @Get(':shortPath')
  async redirectToOriginal(
    @Param('shortPath') shortPath: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '';

      const host = req.headers.host || ''; // Получаем домен, например "site1.ru"
      const originalUrl =
        await this.linksService.getOriginalUrlAndIncreaseCounter(
          shortPath,
          ip,
          host,
        );

      return res.send(`
      <html>
        <head><meta http-equiv="refresh" content="0;url=${originalUrl}" /></head>
      </html>
    `);
    } catch (error: any) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
}
