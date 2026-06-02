import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface ScheduleInfoChipProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  iconColor?: string;
}

/**
 * A small info chip displaying an icon, a label, and a value.
 * Used in the schedule detail header bar for date, time, recurrence.
 */
export function ScheduleInfoChip({
  icon,
  label,
  value,
  iconColor = '#8fb87a',
}: ScheduleInfoChipProps) {
  return (
    <XStack alignItems="center" gap="$2">
      <Feather name={icon} size={16} color={iconColor} />
      <YStack>
        <Text
          fontSize={10}
          fontWeight="700"
          color="$color8"
          letterSpacing={1.2}
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Text fontSize="$2" fontWeight="600" color="$color12">
          {value}
        </Text>
      </YStack>
    </XStack>
  );
}
