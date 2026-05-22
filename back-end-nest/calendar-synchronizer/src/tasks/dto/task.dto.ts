import { tasks } from "src/generated/prisma/client";

export class TaskDto implements tasks {
    id: string;
    title: string;
    parent_task_id: string | null;
    description: string | null;
    deadline: Date | null;
    created_at: Date;
    user_id: string;
    completed: boolean;
    subtasks?: TaskDto[];
}