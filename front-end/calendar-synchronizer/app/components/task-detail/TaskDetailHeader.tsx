import React from 'react';
import { XStack, YStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface TaskDetailHeaderProps {
  title: string;
  isEditing: boolean;
  onEditPress: () => void;
  onSave: () => void;
}

/**
 * Header section for the task detail page.
 * Shows the task title and an edit/cancel toggle or save button.
 */
export function TaskDetailHeader({
  title,
  isEditing,
  onEditPress,
  onSave,
}: TaskDetailHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="flex-start">
      <YStack flex={1} gap="$1">
        <Text fontSize="$8" fontWeight="800" color="$color12">
          {title}
        </Text>
      </YStack>

      <XStack gap="$2">
        {isEditing && (
          <Button
            size="$3"
            backgroundColor="$accent8"
            borderRadius="$3"
            pressStyle={{ opacity: 0.8 }}
            onPress={onSave}
            icon={<Feather name="save" size={14} color="#fff" />}
          >
            <Text fontSize="$2" fontWeight="600" color="#fff">
              Save Changes
            </Text>
          </Button>
        )}

        <Button
          size="$3"
          backgroundColor={isEditing ? '$color3' : '$color3'}
          borderRadius="$3"
          borderWidth={1}
          borderColor={isEditing ? '$color5' : '$color5'}
          pressStyle={{ opacity: 0.8 }}
          onPress={onEditPress}
          icon={
            <Feather
              name={isEditing ? 'x' : 'edit-2'}
              size={14}
              color={isEditing ? '#f87171' : '#ccc'}
            />
          }
        >
          <Text
            fontSize="$2"
            fontWeight="600"
            color={isEditing ? '#f87171' : '$color11'}
          >
            {isEditing ? 'Cancel' : 'Edit Task'}
          </Text>
        </Button>
      </XStack>
    </XStack>
  );
}
