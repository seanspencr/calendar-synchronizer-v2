import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import { tasks } from '../generated/prisma/client';

@Controller('tasks')
export class TasksController {


  constructor(private readonly tasksService: TasksService) {

  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  create(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<tasks> {
    let user = req.user as AccessTokenPayload;
    createTaskDto.user_id = user.userId;
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  findAll(@Req() req): Promise<tasks[]> {
    let user = req.user as AccessTokenPayload;
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard("jwt"))
  findOne(@Param('id') id: string, @Req() req): Promise<tasks> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req): Promise<tasks> {

    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  remove(@Param('id') id: string): Promise<tasks> {
    return this.tasksService.remove(id);
  }
}
