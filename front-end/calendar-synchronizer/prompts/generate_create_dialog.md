In dashbaord sidebar, the create new button should display a popup dialog form for user to insert a new task or a new schedule

for createTask, refer to createTaskDto
for create schedule, refer to scheduleDto

export interface CreateTaskDto {
    'title': string;
    'description'?: object;
    'deadline'?: object;
    'created_at'?: object;
    'completed': object;
    'parent_task_id': object;
}
export class ScheduleDto implements schedulesModel {
    @ApiProperty()
    external_event_id: string | null;
    @ApiProperty()
    id: string;
    @ApiProperty()
    event: string | null;
    @ApiProperty()
    event_date: Date;
    @ApiProperty()
    start_time: Date;
    @ApiProperty()
    end_time: Date;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    schedule_recurrence_id: string | null;
    @ApiProperty()
    created_by: string;
    @ApiProperty()
    schedule_provider: schedule_provider;
}

please prioritize utilizing tamagui components as much as possible, you dont need to copy the exact same style as the attached screenshot

please use dummy mutation for form submission and response : 
- create schedule
- create task


MAKE SURE THE CODE IS READABLE AND MAINTAINABLE WITH ATOMIC COMPONENTS