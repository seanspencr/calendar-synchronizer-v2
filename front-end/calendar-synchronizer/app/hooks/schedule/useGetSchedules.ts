import { useEffect, useState } from 'react';
import { ScheduleService } from '../../services/scheduleService';
import { ScheduleDto } from '../../api-client';

/**
 * Fetches the list of all schedules.
 * Replace with real API call: GET /schedules
 */
export function useGetSchedules() {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSchedules() {
    try {
      setIsLoading(true);
      const schedules = await ScheduleService.findAll();
      setSchedules(schedules);

    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      console.error("Error fetching schedules:", err);
    }
  }


  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, setSchedules, isLoading, error };
}
