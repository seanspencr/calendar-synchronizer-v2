import React from 'react';
import { YStack, Text } from 'tamagui';

interface TaskDescriptionProps {
  description: string;
}

/**
 * Read-only description card for the task detail page.
 * Renders the description text inside a styled card with a left accent border.
 */
export function TaskDescription({ description }: TaskDescriptionProps) {
  return (
    <YStack gap="$2" marginTop="$4">
      <Text
        fontSize={11}
        fontWeight="700"
        color="$color8"
        letterSpacing={1.5}
        textTransform="uppercase"
      >
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
        paddingVertical="$4"
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
