import React from 'react';
import { XStack, YStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface ScheduleDetailHeaderProps {
  title: string;
  isEditing: boolean;
  onEditPress: () => void;
}

/**
 * Header section for the schedule detail page.
 * Shows the "Event Title" label, the schedule title, and the edit toggle button.
 */
export function ScheduleDetailHeader({
  title,
  isEditing,
  onEditPress,
}: ScheduleDetailHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="flex-start">
      <YStack flex={1} gap="$1">
        <Text
          fontSize={11}
          fontWeight="600"
          color="$color7"
          letterSpacing={1.5}
          textTransform="uppercase"
        >
          Event Title
        </Text>
        <Text fontSize="$8" fontWeight="800" color="$color12">
          {title}
        </Text>
      </YStack>

      <Button
        size="$3"
        backgroundColor={isEditing ? '$accent8' : '$color3'}
        borderRadius="$3"
        borderWidth={1}
        borderColor={isEditing ? '$accent9' : '$color5'}
        pressStyle={{ opacity: 0.8 }}
        onPress={onEditPress}
        icon={
          <Feather
            name={isEditing ? 'x' : 'edit-2'}
            size={14}
            color={isEditing ? '#fff' : '#ccc'}
          />
        }
      >
        <Text
          fontSize="$2"
          fontWeight="600"
          color={isEditing ? '#fff' : '$color11'}
        >
          {isEditing ? 'Cancel' : 'Edit Event'}
        </Text>
      </Button>
    </XStack>
  );
}
