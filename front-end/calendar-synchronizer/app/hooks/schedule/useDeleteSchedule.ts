import { useState, useCallback } from 'react';
import type { ScheduleDto } from '../../api-client';
import { ScheduleService } from '../../services/scheduleService';

/**
 * Deletes a schedule with optimistic update.
 * Real API call: DELETE /schedules/:id
 *
 * Usage:
 *   const { deleteSchedule, isLoading, error } = useDeleteSchedule(setSchedules);
 */
export function useDeleteSchedule(
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleDto[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSchedule = useCallback(
    async (id: string) => {
      // Snapshot for rollback
      let removed: ScheduleDto | undefined;

      // Optimistic update: remove immediately from list
      setSchedules((prev) => {
        removed = prev.find((s) => s.id === id);
        return prev.filter((s) => s.id !== id);
      });

      setIsLoading(true);
      setError(null);

      try {
        await ScheduleService.removeSchedule(id);
      } catch (err) {
        // Roll back on failure
        if (removed) {
          setSchedules((prev) => [...prev, removed!]);
        }
        setError(err instanceof Error ? err.message : 'Failed to delete schedule');
      } finally {
        setIsLoading(false);
      }
    },
    [setSchedules],
  );

  return { deleteSchedule, isLoading, error };
}
