import { useCallback } from 'react'
import { ScheduleDto, UpdateScheduleDto } from '@/app/api-client';
import { ScheduleService } from '@/app/services/scheduleService';

export function useUpdateSchedule(
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleDto | null>>,
) {
  const updateSchedule = useCallback(
    async (id: string, data: UpdateScheduleDto) => {
      // Optimistic update
      setSchedule((prev: ScheduleDto | null) => {
        if (!prev) return prev;

        // Optimistically update recurrence if passed in UpdateScheduleDto cast
        const anyData = data as any;
        let newRecurrence = prev.recurrence;
        if (anyData.recurrence !== undefined) {
          newRecurrence = anyData.recurrence;
        }

        return {
          ...prev,
          event: data.event as unknown as string ?? prev.event,
          event_date: data.event_date as unknown as string ?? prev.event_date,
          end_time: data.end_time as unknown as string ?? prev.end_time,
          start_time: data.start_time as unknown as string ?? prev.start_time,
          description: data.description as unknown as string ?? prev.description,
          recurrence: newRecurrence,
        };
      });

      await ScheduleService.updateSchedule(id, data);
      // In real impl: await schedulesApi.schedulesControllerUpdate(id, data)
    },
    [setSchedule],
  );

  return { updateSchedule };
}
