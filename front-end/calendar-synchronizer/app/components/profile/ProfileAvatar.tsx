import React from 'react';
import { YStack, Text, Avatar } from 'tamagui';

interface ProfileAvatarProps {
  username: string;
  avatarUrl?: string | null;
}

/**
 * Profile avatar with fallback to a generated avatar based on the username.
 * Displayed prominently at the top of the profile page.
 */
export function ProfileAvatar({ username, avatarUrl }: ProfileAvatarProps) {
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=4a7c59&color=fff&size=256&bold=true`;

  return (
    <YStack alignItems="center" gap="$3">
      <Avatar circular size="$12">
        <Avatar.Image
          accessibilityLabel={username}
          src={avatarUrl || fallbackSrc}
        />
        <Avatar.Fallback backgroundColor="$color5" />
      </Avatar>

      <Text fontSize="$8" fontWeight="800" color="$color12">
        {username}
      </Text>
    </YStack>
  );
}
