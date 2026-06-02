import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface TaskInfoBarProps {
  deadline: string;
  parentTaskTitle?: string | null;
  parentTaskId?: string | null;
  onParentTaskPress?: () => void;
}

/**
 * Horizontal bar showing deadline and parent task info chips.
 * Displayed at the bottom of the task detail page.
 */
export function TaskInfoBar({
  deadline,
  parentTaskTitle,
  parentTaskId,
  onParentTaskPress,
}: TaskInfoBarProps) {
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
      marginTop="$5"
    >
      {/* Deadline chip */}
      <XStack alignItems="center" gap="$2">
        <Feather name="calendar" size={16} color="#f87171" />
        <YStack>
          <Text
            fontSize={10}
            fontWeight="700"
            color="$color8"
            letterSpacing={1.2}
            textTransform="uppercase"
          >
            Deadline
          </Text>
          <Text fontSize="$2" fontWeight="600" color="$color12">
            {deadline}
          </Text>
        </YStack>
      </XStack>

      {/* Divider */}
      {parentTaskTitle && (
        <XStack
          width={1}
          height={30}
          backgroundColor="$color5"
          alignSelf="center"
        />
      )}

      {/* Parent task chip */}
      {parentTaskTitle && (
        <XStack
          alignItems="center"
          gap="$2"
          pressStyle={onParentTaskPress ? { opacity: 0.7 } : undefined}
          cursor={onParentTaskPress ? 'pointer' : undefined}
          onPress={onParentTaskPress}
        >
          <Feather name="layers" size={16} color="#8fb87a" />
          <YStack>
            <Text
              fontSize={10}
              fontWeight="700"
              color="$color8"
              letterSpacing={1.2}
              textTransform="uppercase"
            >
              Parent Task
            </Text>
            <Text
              fontSize="$2"
              fontWeight="600"
              color={onParentTaskPress ? '$accent9' : '$color12'}
              textDecorationLine={onParentTaskPress ? 'underline' : 'none'}
            >
              {parentTaskTitle}
            </Text>
          </YStack>
        </XStack>
      )}
    </XStack>
  );
}
