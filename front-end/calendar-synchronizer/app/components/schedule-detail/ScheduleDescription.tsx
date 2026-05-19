import React from 'react';
import { YStack, Text } from 'tamagui';

interface ScheduleDescriptionProps {
  description: string;
}

/**
 * Read-only description card for the schedule detail page.
 * Renders the description text inside a styled card with a left accent border.
 */
export function ScheduleDescription({ description }: ScheduleDescriptionProps) {
  return (
    <YStack gap="$2" marginTop="$4">
      <Text fontSize="$5" fontWeight="700" color="$color12">
        Description
      </Text>

      <YStack
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color4"
        borderLeftWidth={3}
        borderLeftColor="$accent8"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <Text
          fontSize="$3"
          color="$color10"
          lineHeight={22}
          whiteSpace="pre-wrap"
        >
          {description}
        </Text>
      </YStack>
    </YStack>
  );
}
