import { useEffect, useState } from 'react';
import type { ScheduleDto } from '../../api-client';
import { ScheduleService } from '@/app/services/scheduleService';

/**
 * Fetches a single schedule by ID.
 * Replace with real API call: GET /schedules/:id
 */
export function useGetScheduleDetail(id: string) {
  const [schedule, setSchedule] = useState<ScheduleDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSchedule() {
    try {
      setIsLoading(true);
      const schedule = await ScheduleService.findOne(id);
      setSchedule(schedule);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
      console.error("Error fetching schedule:", err);
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  return { schedule, setSchedule, isLoading, error };
}
