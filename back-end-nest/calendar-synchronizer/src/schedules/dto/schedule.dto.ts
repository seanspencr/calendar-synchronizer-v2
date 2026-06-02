import { ApiProperty } from "@nestjs/swagger";
import { recurrence_period, schedule_provider } from "src/generated/prisma/enums";
import { schedulesModel } from "src/generated/prisma/models";

export class RecurrenceDto {
    @ApiProperty()
    recurrence_interval: number;
    @ApiProperty({ enum: recurrence_period })
    recurrence_period: recurrence_period;
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
    @ApiProperty({ required: false, nullable: true })
    description: string | null;
    @ApiProperty({ type: RecurrenceDto, nullable: true })
    recurrence: RecurrenceDto | null;
}