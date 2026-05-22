import { schedule_provider } from "src/generated/prisma/enums";
import { schedule_recurrencesCreateNestedOneWithoutSchedulesInput, schedulesCreateInput, usersCreateNestedOneWithoutSchedulesInput } from "src/generated/prisma/models";

export class CreateScheduleDto implements Partial<schedulesCreateInput> {

    id?: string | undefined;
    event?: string | null | undefined;
    event_date: string | Date;
    start_time?: string | Date | undefined;
    end_time?: string | Date | undefined;
    schedule_provider?: schedule_provider;
    user_id: string;
    external_event_id?: string | null | undefined;
    description?: string | null | undefined;
}
