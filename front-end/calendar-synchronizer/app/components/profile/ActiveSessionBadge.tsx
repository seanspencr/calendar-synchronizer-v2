import React from 'react';
import { XStack, YStack, Text } from 'tamagui';

interface ActiveSessionBadgeProps {
  email: string;
}

/**
 * Small status badge showing the currently active session email
 * with a green dot indicator.
 */
export function ActiveSessionBadge({ email }: ActiveSessionBadgeProps) {
  return (
    <XStack alignItems="center" gap="$2" paddingVertical="$2">
      <YStack
        width={8}
        height={8}
        borderRadius={4}
        backgroundColor="#4ade80"
      />
      <Text fontSize="$2" fontWeight="600" color="$color8" letterSpacing={0.5}>
        Active Session:
      </Text>
      <Text fontSize="$2" fontWeight="600" color="$color11">
        {email}
      </Text>
    </XStack>
  );
}
