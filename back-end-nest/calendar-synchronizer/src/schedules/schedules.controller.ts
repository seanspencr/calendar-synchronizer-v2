import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Post('/sync/microsoft')
  @UseGuards(AuthGuard('jwt'))
  syncMicrosoftEvents(@Req() req) {
    return this.schedulesService.syncMicrosoftEvents(req.user as AccessTokenPayload);
  }

  @Post('/sync/google')
  @UseGuards(AuthGuard('jwt'))
  syncGoogleEvents(@Req() req) {
    return this.schedulesService.syncGoogleEvents(req.user as AccessTokenPayload);
  }



  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    return this.schedulesService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
