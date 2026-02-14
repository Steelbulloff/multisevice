import {
  Body,
  Controller,
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
import { CreateLinkDto, DeleteLinksDto, GetLinkDto } from './dto';
import type { Request, Response } from 'express';
import { Public } from 'src/core';

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @UseGuards(JwtAuthGuard)
  @Post('api/create')
  createLink(@Body() params: CreateLinkDto, @Req() req: any) {
    return this.linksService.createLink(params, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/get-links')
  getLinks() {
    return this.linksService.getLinks();
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/get-link/:id')
  getLinkInfo(@Param('id') id: number, @Query() query: GetLinkDto) {
    return this.linksService.getLinkInfo(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/delete')
  removeLinks(@Body() params: DeleteLinksDto) {
    return this.linksService.removeLinks(params);
  }
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

      const originalUrl =
        await this.linksService.getOriginalUrlAndIncreaseCounter(shortPath, ip);

      return res.send(`
      <html>
        <head><meta http-equiv="refresh" content="0;url=${originalUrl}" /></head>
      </html>
    `);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
}
