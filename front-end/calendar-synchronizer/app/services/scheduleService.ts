// Assuming schedulesApi is exported from your apiService alongside authApi
import { schedulesApi } from "./apiService";
import { 
  CreateScheduleDto, 
  ScheduleDto,
  UpdateScheduleDto,
} from '../api-client'; // Adjust this import path based on your setup

export const ScheduleService = {
  
  /**
   * POST /schedules
   * Creates a standard schedule
   */
  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {
    try {
      const response = await schedulesApi.schedulesControllerCreate(createScheduleDto);
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  },

  /**
   * POST /schedules/natural-language
   * Creates a schedule via AI/Natural Language query
   */
  async createWithNaturalLanguage(query: string): Promise<ScheduleDto> {
    try {
      const response = await schedulesApi.schedulesControllerCreateWithNaturalLanguage({
        query: query 
      });
      return response.data;
    } catch (error) {
      console.error("Error creating schedule from natural language:", error);
      throw error;
    }
  },

  /**
   * POST /schedules/sync/microsoft
   * Syncs events from Microsoft Calendar
   */
  async syncMicrosoftEvents(): Promise<ScheduleDto[]> {
    try {
      const response = await schedulesApi.schedulesControllerSyncMicrosoftEvents();
      return response.data;
    } catch (error) {
      console.error("Error syncing Microsoft events:", error);
      throw error;
    }
  },

  /**
   * POST /schedules/sync/google
   * Syncs events from Google Calendar
   */
  async syncGoogleEvents(): Promise<ScheduleDto[]> {
    try {
      const response = await schedulesApi.schedulesControllerSyncGoogleEvents();
      return response.data;
    } catch (error) {
      console.error("Error syncing Google events:", error);
      throw error;
    }
  },

  /**
   * GET /schedules
   * Fetches all schedules for the logged-in user
   */
  async findAll(): Promise<ScheduleDto[]> {
    try {
      const response = await schedulesApi.schedulesControllerFindAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching all schedules:", error);
      throw error;
    }
  },

  /**
   * GET /schedules/:id
   * Fetches a single schedule by ID
   */
  async findOne(id: string): Promise<ScheduleDto> {
    try {
      const response = await schedulesApi.schedulesControllerFindOne(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  },

  /**
   * PATCH /schedules/:id
   * Updates an existing schedule
   */
  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleDto> {
    try {
      const response = await schedulesApi.schedulesControllerUpdate(id, updateScheduleDto);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  },

  /**
   * DELETE /schedules/:id
   * Removes a schedule
   */
  async removeSchedule(id: string): Promise<ScheduleDto> {
    try {
      const response = await schedulesApi.schedulesControllerRemove(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  }
};