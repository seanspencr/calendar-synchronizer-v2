import React from 'react';
import { XStack } from 'tamagui';
import { ScheduleInfoChip } from './ScheduleInfoChip';
import type { RecurrenceInterval, RECURRENCE_LABELS } from './types';

interface ScheduleInfoBarProps {
  date: string;
  timeRange: string;
  recurrenceLabel: string;
}

/**
 * Horizontal bar showing date, time, and recurrence info chips.
 * Displayed below the schedule title in read mode.
 */
export function ScheduleInfoBar({
  date,
  timeRange,
  recurrenceLabel,
}: ScheduleInfoBarProps) {
  return (
    <XStack
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color4"
      paddingHorizontal="$4"
      paddingVertical="$3"
      gap="$5"
      alignItems="center"
      flexWrap="wrap"
    >
      <ScheduleInfoChip icon="calendar" label="Date" value={date} />

      {/* Vertical divider */}
      <XStack
        width={1}
        height={30}
        backgroundColor="$color5"
        alignSelf="center"
      />

      <ScheduleInfoChip icon="clock" label="Time" value={timeRange} />

      <XStack
        width={1}
        height={30}
        backgroundColor="$color5"
        alignSelf="center"
      />

      <ScheduleInfoChip
        icon="refresh-cw"
        label="Recurrence"
        value={recurrenceLabel}
      />
    </XStack>
  );
}
