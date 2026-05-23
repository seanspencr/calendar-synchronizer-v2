import { CreateScheduleDto } from "src/schedules/dto/create-schedule.dto";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";

export class LlmResponseDto {
    dto : CreateScheduleDto | CreateTaskDto;
    responseMessage : string;
}