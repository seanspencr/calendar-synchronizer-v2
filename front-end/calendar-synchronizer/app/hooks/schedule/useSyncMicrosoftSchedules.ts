import { useEffect, useState } from "react";
import { ScheduleDto, TaskDto } from "../../api-client";
import { ScheduleService } from "@/app/services/scheduleService";

export function useSyncMicrosoftSchedules(
    refetchSchedules: () => Promise<void>
) {

    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function sync() {
        setIsLoading(true)

        try {
            const res = await ScheduleService.syncMicrosoftEvents()
            await refetchSchedules()
        } catch (error) {
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    return { sync, isError, isLoading }
}