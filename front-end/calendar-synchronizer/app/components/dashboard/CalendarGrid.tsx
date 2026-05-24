import React, { useMemo, useState, useCallback } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { ScheduleDto } from '../../api-client';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface CalendarGridProps {
  events: ScheduleDto[];
}

function getEventColor(source?: string): string {
  switch (source) {
    case 'GOOGLE': return '#c4ad8d';
    case 'MICROSOFT': return '#779fbb';
    default: return '#a5c479';
  }
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < startPadding; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);
  return days;
}

function EventChip({ event, onPress }: { event: ScheduleDto; onPress: () => void }) {
  return (
    <XStack
      backgroundColor={getEventColor(event.schedule_provider)}
      borderRadius="$1"
      paddingHorizontal="$1"
      paddingVertical={2}
      marginTop={2}
      pressStyle={{ opacity: 0.7 }}
      cursor="pointer"
      onPress={onPress}
    >
      <Text fontSize={9} color="#e0ddd5" numberOfLines={1}>{event.event}</Text>
    </XStack>
  );
}

function DayCell({ day, events, isToday, onEventPress }: { day: number | null; events: ScheduleDto[]; isToday: boolean; onEventPress: (id: string) => void }) {
  if (day === null) return <YStack flex={1} minHeight={80} borderWidth={0.5} borderColor="$color3" />;
  return (
    <YStack flex={1} minHeight={80} borderWidth={0.5} borderColor="$color3" padding="$1">
      <Text fontSize="$2" fontWeight={isToday ? '700' : '400'} color={isToday ? '$accent9' : '$color10'}>
        {String(day).padStart(2, '0')}
      </Text>
      {events.slice(0, 2).map((e) => <EventChip key={e.id} event={e} onPress={() => onEventPress(e.id)} />)}
      {events.length > 2 && <Text fontSize={9} color="$color7" marginTop={2}>+{events.length - 2} more</Text>}
    </YStack>
  );
}

export function CalendarGrid({ events }: CalendarGridProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const eventsByDay = useMemo(() => {
    const map = new Map<number, ScheduleDto[]>();
    events.forEach((event) => {
      const d = new Date(event.event_date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(event);
      }
    });
    return map;
  }, [events, year, month]);

  const goToPrev = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
  const goToNext = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getMonthDays(year, month);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  while (rows.length > 0 && rows[rows.length - 1].length < 7) rows[rows.length - 1].push(null);

  return (
    <YStack backgroundColor="$color1" borderRadius="$4" padding="$3">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$7" fontWeight="700" color="$color12">{monthLabel}</Text>
          <XStack gap="$1">
            <Button unstyled onPress={goToPrev} padding="$1" borderRadius="$2" borderWidth={1} borderColor="$color5">
              <Feather name="chevron-left" size={16} color="#aaa" />
            </Button>
            <Button unstyled onPress={goToNext} padding="$1" borderRadius="$2" borderWidth={1} borderColor="$color5">
              <Feather name="chevron-right" size={16} color="#aaa" />
            </Button>
          </XStack>
        </XStack>
      </XStack>
      <XStack>
        {DAYS_OF_WEEK.map((dow) => (
          <YStack key={dow} flex={1} alignItems="center" paddingVertical="$1">
            <Text fontSize="$1" fontWeight="700" color="$color7" letterSpacing={1}>{dow}</Text>
          </YStack>
        ))}
      </XStack>
      {rows.map((row, ri) => (
        <XStack key={`row-${ri}`}>
          {row.map((day, ci) => (
            <DayCell key={`c-${ri}-${ci}`} day={day} events={day ? eventsByDay.get(day) || [] : []} isToday={isCurrentMonth && day === today.getDate()} onEventPress={(id) => router.push(`/schedule/${id}`)} />
          ))}
        </XStack>
      ))}
    </YStack>
  );
}
