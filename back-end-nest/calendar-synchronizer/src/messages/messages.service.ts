import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { DatabaseService } from 'src/database/database.service';
import { messages, prompt_type } from 'src/generated/prisma/client';
import { AiService } from 'src/ai/ai.service';
import { CreateScheduleDto } from 'src/schedules/dto/create-schedule.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { SchedulesService } from 'src/schedules/schedules.service';
import { TasksService } from 'src/tasks/tasks.service';
import { LlmResponseDto } from './dto/llm-response.dto';

@Injectable()
export class MessagesService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly aiService: AiService,
    private readonly scheduleService: SchedulesService,
    private readonly taskService: TasksService) {
  }

  async create(userId: string, createMessageDto: CreateMessageDto): Promise<messages> {
    
    await this.databaseService.messages.create({
      data: {
        ...createMessageDto,
        user_id: userId
      }
    });

    const promptTypeResponse = await this.aiService.queryLmForJson(
      `
        Classify the user's message into EXACTLY one of these categories and return a JSON object.

        Valid categories (use exactly as written):
        - "CREATE_TASK"     : the user wants to create a task or to-do item
        - "CREATE_SCHEDULE" : the user wants to create a calendar event or schedule
        - "CREATE_TODOLIST" : the user wants to create a to-do list
        - "OTHER"           : the message does not match any of the above

        Rules:
        - You MUST respond with ONLY a JSON object in this exact shape: { "promptType": "<category>" }
        - The value of promptType MUST be one of: CREATE_TASK, CREATE_SCHEDULE, CREATE_TODOLIST, OTHER
        - Do NOT include any explanation or extra text outside the JSON

        User message: "${createMessageDto.content}"
      `
    );
    const promptType: prompt_type = await JSON.parse(promptTypeResponse).promptType;


    let llmRes: LlmResponseDto;
    switch (promptType) {
      case 'CREATE_SCHEDULE':
        llmRes = await JSON.parse(await this.aiService.queryLmForJson(
          `
            You are a calendar assistant. Extract the schedule details from the user message and return a JSON object.

            The JSON object MUST have exactly this shape:
            {
              "dto": {
                "event":       string | null,          // (optional) name/title of the event
                "event_date":  string,                 // (REQUIRED) date of the event in ISO 8601 format (YYYY-MM-DD)
                "start_time":  string | null,          // (optional) start time in ISO 8601 format
                "end_time":    string | null,          // (optional) end time in ISO 8601 format
                "description": string | null           // (optional) additional description
              },
              "responseMessage": string                // a friendly confirmation message to show the user
            }

            Rules:
            - Only include the fields listed above inside "dto" — do NOT add any extra fields
            - "event_date" is required; infer it from the user message
            - Use today's date as a reference if the user says relative terms like "tomorrow" or "next Monday" (today is ${new Date().toISOString().split('T')[0]})
            - Do NOT include "user_id" — it will be added by the server
            - Do NOT add any text outside the JSON

            User message: "${createMessageDto.content}"
          `
        ));
        (llmRes.dto as CreateScheduleDto).user_id = userId;
        await this.scheduleService.create(llmRes.dto as CreateScheduleDto);

        return this.databaseService.messages.create({
          data: {
            ...createMessageDto,
            user_id: userId,
            message_type: 'RESPONSE',
            content: llmRes.responseMessage
          }
        });
      case 'CREATE_TASK':
        llmRes = await JSON.parse(await this.aiService.queryLmForJson(
          `
            You are a task management assistant. Extract the task details from the user message and return a JSON object.

            The JSON object MUST have exactly this shape:
            {
              "dto": {
                "title":          string,              // (REQUIRED) short title of the task
                "description":    string | null,       // (optional) more detail about the task
                "deadline":       string | null,       // (optional) deadline in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
                "completed":      boolean,             // (optional, default false) whether the task is already done
                "parent_task_id": string | null        // (optional) UUID of a parent task if this is a sub-task; otherwise null
              },
              "responseMessage": string                // a friendly confirmation message to show the user
            }

            Rules:
            - Only include the fields listed above inside "dto" — do NOT add any extra fields
            - "title" is required; derive it from the user message
            - Use today's date as a reference if the user gives relative deadlines (today is ${new Date().toISOString().split('T')[0]})
            - "completed" should default to false unless the user explicitly says the task is done
            - "parent_task_id" should be null unless the user explicitly references a parent task
            - Do NOT include "user_id" or "created_at" — they are added by the server
            - Do NOT add any text outside the JSON

            User message: "${createMessageDto.content}"
          `
        ));
        await this.taskService.create(userId, llmRes.dto as CreateTaskDto);

        return this.databaseService.messages.create({
          data: {
            ...createMessageDto,
            user_id: userId,
            message_type: 'RESPONSE',
            content: llmRes.responseMessage
          }
        });
      // case 'CREATE_TODOLIST':
      //   const createTodolistDto = await JSON.parse(await this.aiService.queryLmForJson(createMessageDto.content));
      //   break;
      default:
        throw new BadRequestException('Unsupported task type, please only give prompt related to : create schedule, create task, and create todolist')
    }


  }

  findToday(userId: string): Promise<messages[]> {
    return this.databaseService.messages.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    });
  }
}
