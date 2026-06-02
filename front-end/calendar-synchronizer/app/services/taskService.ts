import { tasksApi } from "./apiService";
import { CreateTaskDto, TaskDto, UpdateTaskDto } from '../api-client';

export const TaskService = {

  /**
   * POST /tasks
   * Creates a new task
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDto> {
    try {
      const response = await tasksApi.tasksControllerCreate(createTaskDto);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  /**
   * GET /tasks
   * Fetches all tasks
   */
  async findAll(): Promise<TaskDto[]> {
    try {
      const response = await tasksApi.tasksControllerFindAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },

  /**
   * GET /tasks/:id
   * Fetches a single task by ID
   */
  async findOne(id: string): Promise<TaskDto> {
    try {
      const response = await tasksApi.tasksControllerFindOne(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  /**
   * PATCH /tasks/:id
   * Updates an existing task
   */
  async updateTask(id: string, body: UpdateTaskDto): Promise<TaskDto> {
    try {
      const response = await tasksApi.tasksControllerUpdate(id, body);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  /**
   * DELETE /tasks/:id
   * Removes a task
   */
  async removeTask(id: string): Promise<TaskDto> {
    try {
      const response = await tasksApi.tasksControllerRemove(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },



};
