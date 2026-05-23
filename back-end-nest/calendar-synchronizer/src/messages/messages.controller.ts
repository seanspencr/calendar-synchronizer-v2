import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: MessageDto })
  create(@Req() req, @Body() createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const user = req.user as AccessTokenPayload
    return this.messagesService.create(user.userId, createMessageDto);
  }


  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: [MessageDto] })
  findToday(@Req() req): Promise<MessageDto[]> {
    const user = req.user as AccessTokenPayload;
    return this.messagesService.findToday(user.userId);
  }

}
