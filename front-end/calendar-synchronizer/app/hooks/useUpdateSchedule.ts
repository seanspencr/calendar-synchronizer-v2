import { useCallback } from 'react';
import type { ScheduleDetailDto } from '../components/schedule-detail/types';
import type { ScheduleEditFormData } from '../components/schedule-detail/types';

/**
 * Updates schedule fields.
 * Replace with real API call: PUT /schedules/:id
 */
export function useUpdateSchedule(
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleDetailDto | null>>,
) {
  const updateSchedule = useCallback(
    (data: ScheduleEditFormData) => {
      // Optimistic update
      setSchedule((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
          recurrenceInterval: data.recurrenceInterval,
          recurrenceCount: data.recurrenceCount,
        };
      });
      // In real impl: await schedulesApi.schedulesControllerUpdate(id, data)
    },
    [setSchedule],
  );

  return { updateSchedule };
}
