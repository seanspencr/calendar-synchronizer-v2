import { tasks } from "src/generated/prisma/client";
import { CreateTaskDto } from "./create-task.dto";
import { PartialType } from "@nestjs/swagger";

export class TaskCompactDto {
    id : string
    deadline: Date | null
    description: string | null
    title: string
    is_todo: boolean
    subtasks: TaskCompactDto[] | undefined
}