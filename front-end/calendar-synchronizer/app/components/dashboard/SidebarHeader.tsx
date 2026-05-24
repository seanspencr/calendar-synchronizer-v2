import React from 'react';
import { XStack, YStack, Text, Avatar, Card } from 'tamagui';
import type { UserProfile } from './types';
import { LoginResponseDto } from '@/app/api-client/api';

interface SidebarHeaderProps {
  user: LoginResponseDto;
}

/** Sidebar header showing profile picture, username, and hub label */
export function SidebarHeader({ user }: SidebarHeaderProps) {
  return (
    <YStack alignItems="center" paddingVertical="$4" gap="$2">
      <Avatar circular size="$6">
        <Avatar.Image
          accessibilityLabel={user.username}
          src={
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
        {user.username}
      </Text>

    </YStack>
  );
}
