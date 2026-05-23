import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, ForbiddenException, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import { CreateScheduleNaturalLanguageDto } from './dto/create-schedule-natural-language';
import { ScheduleDto } from './dto/schedule.dto';
import { schedules } from 'src/generated/prisma/client';
import { ApiResponse } from '@nestjs/swagger';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: ScheduleDto })
  create(@Body() createScheduleDto: CreateScheduleDto, @Req() req): Promise<ScheduleDto> {
    createScheduleDto.user_id = (req.user as AccessTokenPayload).userId;
    return this.schedulesService.create(createScheduleDto);
  }

  @Post('/natural-language')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: ScheduleDto })
  createWithNaturalLanguage(@Body() query: CreateScheduleNaturalLanguageDto, @Req() req): Promise<ScheduleDto> {
    return this.schedulesService.createWithNaturalLanguage(query.query, req.user as AccessTokenPayload);
  }

  @Post('/sync/microsoft')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: [ScheduleDto] })
  syncMicrosoftEvents(@Req() req): Promise<ScheduleDto[]> {
    return this.schedulesService.syncMicrosoftEvents(req.user as AccessTokenPayload);
  }

  @Post('/sync/google')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: [ScheduleDto] })
  syncGoogleEvents(@Req() req): Promise<ScheduleDto[]> {
    return this.schedulesService.syncGoogleEvents(req.user as AccessTokenPayload);
  }



  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: [ScheduleDto] })
  findAll(@Req() req): Promise<ScheduleDto[]> {
    return this.schedulesService.findAll(req.user.userId);
  }

  @Get('range')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: [ScheduleDto] })
  findByDateRange(
    @Req() req,
    @Query('minDate') minDate?: string,
    @Query('maxDate') maxDate?: string,
  ): Promise<ScheduleDto[]> {
    return this.schedulesService.findByDateRange(req.user.userId, minDate, maxDate);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: ScheduleDto })
  async findOne(@Param('id') id: string): Promise<ScheduleDto> {
    const schedule = await this.schedulesService.findOne(id);

    if (!schedule) {
      throw new NotFoundException("Schedule not found");
    }

    return schedule!
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: ScheduleDto })
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto): Promise<ScheduleDto> {
    return this.schedulesService.update(id, updateScheduleDto);


  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: ScheduleDto })
  async remove(@Param('id') id: string, @Req() req): Promise<ScheduleDto> {
    const existing = await this.schedulesService.findOne(id);
    if (!existing) {
      throw new NotFoundException('Schedule not found');
    }
    if (existing.created_by !== (req.user as AccessTokenPayload).userId) {
      throw new ForbiddenException('You are not allowed to delete this schedule');
    }
    const result = await this.schedulesService.remove(id);
    if (!result) {
      throw new NotFoundException("Failed to delete schedule, not found")
    }
    return result;
  }
}
