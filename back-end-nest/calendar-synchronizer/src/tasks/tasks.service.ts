import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/database.service';
import { tasks } from 'src/generated/prisma/client';

@Injectable()
export class TasksService {

  constructor(private readonly userService: UsersService, private readonly databaseService: DatabaseService) { }

  /**
   * Recursively builds a tree of TaskDto from a flat list of tasks.
   * @param allTasks - flat list of all tasks (for a given user or scope)
   * @param parentId - the parent_task_id to start from (null = root level)
   */
  private buildTree(allTasks: tasks[], parentId: string | null): TaskDto[] {
    return allTasks
      .filter((task) => task.parent_task_id === parentId)
      .map((task) => ({
        ...task,
        subtasks: this.buildTree(allTasks, task.id),
      }));
  }

  create(userId: string, createTaskDto: CreateTaskDto) {
    return this.databaseService.tasks.create({
      data: {
        ...createTaskDto,
        user_id: userId
      },
    });
  }

  /**
   * Returns all root tasks (parent_task_id = null) for a user,
   * each with their full subtask tree nested recursively.
   */
  async findAll(user_id: string): Promise<TaskDto[]> {
    const allTasks = await this.databaseService.tasks.findMany({
      where: { user_id },
    });

    // Build tree starting from root tasks (no parent)
    return this.buildTree(allTasks, null);
  }

  /**
   * Returns a single task by ID with its full subtask tree nested recursively.
   * Fetches all tasks for the same user so the tree can be built in-memory.
   */
  async findOne(task_id: string): Promise<TaskDto> {
    // First, find the target task to get its user_id
    const targetTask = await this.databaseService.tasks.findFirstOrThrow({
      where: { id: task_id },
    });

    // Then fetch all tasks for the same user to build the subtree
    const allTasks = await this.databaseService.tasks.findMany({
      where: { user_id: targetTask.user_id },
    });

    // Find the target node and attach its subtree
    const taskNode = allTasks.find((t) => t.id === task_id);
    if (!taskNode) throw new NotFoundException(`Task ${task_id} not found`);

    return {
      ...taskNode,
      subtasks: this.buildTree(allTasks, task_id),
    };
  }

  update(task_id: string, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.tasks.update({
      where: { id: task_id },
      data: updateTaskDto,
    });
  }

  remove(task_id: string) {
    return this.databaseService.tasks.delete({
      where: {
        id: task_id,
      },
    });
  }
}
