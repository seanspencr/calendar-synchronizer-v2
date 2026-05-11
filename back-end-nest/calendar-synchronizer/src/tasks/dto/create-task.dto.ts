import { tasksCreateInput, tasksCreateNestedManyWithoutTasksInput, tasksCreateNestedOneWithoutOther_tasksInput, usersCreateNestedOneWithoutTasksInput } from "src/generated/prisma/models";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto implements Partial<tasksCreateInput> {
    @ApiProperty()
    title: string;
    @ApiProperty({ required: false })
    description?: string | null | undefined;
    @ApiProperty({ required: false })
    deadline?: string | Date | null | undefined;
    @ApiProperty({ required: false })
    created_at?: string | Date | undefined;
    @ApiProperty()
    completed?: boolean | undefined;
    @ApiProperty()
    parent_task_id?: string | undefined;
    user_id: string;
}