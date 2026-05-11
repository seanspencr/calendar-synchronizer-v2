import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {

  constructor(private readonly userService: UsersService, private readonly databaseService: DatabaseService) { }

  create(createTaskDto: CreateTaskDto) {
    return this.databaseService.tasks.create({
      data: createTaskDto
    });
  }

  findAll(user_id: string) {
    return this.databaseService.tasks.findMany(
      {
        where: {
          user_id: user_id
        }
      }
    )
  }

  findOne(task_id: string) {
    return this.databaseService.tasks.findFirstOrThrow({
      where: {
        id: task_id
      }
    });
  }

  update(task_id: string, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.tasks.update({
      where: { id: task_id },
      data: updateTaskDto
    });
  }

  remove(task_id: string) {
    return this.databaseService.tasks.delete({
      where: {
        id: task_id
      }
    });
  }
}
