import { useEffect, useState } from 'react';
import { ScheduleService } from '../../services/scheduleService';
import { ScheduleDto } from '../../api-client';

/**
 * Fetches the list of all schedules.
 * Replace with real API call: GET /schedules
 */
export function useGetSchedules(month: number, year: number) {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DEPRECATED : fetch all, tanpa pagination
  // async function fetchSchedules() {
  //   try {
  //     setIsLoading(true);
  //     const schedules = await ScheduleService.findAll();
  //     setSchedules(schedules);

  //   } catch (err) {
  //     setIsLoading(false)
  //     setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
  //     console.error("Error fetching schedules:", err);
  //   }
  // }


  async function getByDateRange(month: number, year: number) {
    try {
      setIsLoading(true);

      const schedules = await ScheduleService.getByDateRange(
        new Date(year, month, 1).toISOString(),      // First day of the targeted month (e.g., May 1)
        new Date(year, month + 1, 0).toISOString()   // Last day of the targeted month (e.g., May 31)
      );
      setSchedules((prev) => {
        const existingKeys = new Set(prev.map((s) => `${s.id}_${s.event_date}`));

        const newUnique = schedules.filter(
          (s) => !existingKeys.has(`${s.id}_${s.event_date}`)
        );

        return [...prev, ...newUnique];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getByDateRange(month, year);
  }, [month, year]);

  return { schedules, setSchedules, isLoading, error, getByDateRange };
}
