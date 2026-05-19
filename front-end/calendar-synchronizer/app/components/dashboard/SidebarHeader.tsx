import React from 'react';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import type { UserProfile } from './types';

interface SidebarHeaderProps {
  user: UserProfile;
}

/** Sidebar header showing profile picture, username, and hub label */
export function SidebarHeader({ user }: SidebarHeaderProps) {
  return (
    <YStack alignItems="center" paddingVertical="$4" gap="$2">
      <Avatar circular size="$6">
        <Avatar.Image
          accessibilityLabel={user.username}
          src={
            user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4a7c59&color=fff&size=128`
          }
        />
        <Avatar.Fallback backgroundColor="$color5" />
      </Avatar>

      <Text
        fontSize="$5"
        fontWeight="700"
        color="$color12"
        letterSpacing={0.5}
      >
        Strategy Hub
      </Text>
    </YStack>
  );
}
