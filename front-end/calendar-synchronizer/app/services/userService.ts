import { usersApi } from "./apiService";
import { CreateUserDto, UserDto } from '../api-client';

export const UserService = {
  
  /**
   * POST /users
   * Creates a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const response = await usersApi.usersControllerCreate(createUserDto);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * GET /users
   * Fetches all users
   */
  async findAll(): Promise<UserDto[]> {
    try {
      const response = await usersApi.usersControllerFindAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  /**
   * GET /users/:id
   * Fetches a single user by ID
   */
  async findOne(id: string): Promise<UserDto> {
    try {
      const response = await usersApi.usersControllerFindOne(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * PATCH /users/:id
   * Updates an existing user
   */
  async updateUser(id: string, body: object): Promise<UserDto> {
    try {
      const response = await usersApi.usersControllerUpdate(id, body);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * DELETE /users/:id
   * Removes a user
   */
  async removeUser(id: string): Promise<UserDto> {
    try {
      const response = await usersApi.usersControllerRemove(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};
