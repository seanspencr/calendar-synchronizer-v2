import { schedule_provider } from "src/generated/prisma/enums";
import { schedulesModel } from "src/generated/prisma/models";

export class ScheduleDto implements schedulesModel {
    id: string;
    event: string | null;
    event_date: Date;
    start_time: Date;
    end_time: Date;
    created_at: Date;
    schedule_recurrence_id: string | null;
    created_by: string;
    schedule_provider: schedule_provider;
}