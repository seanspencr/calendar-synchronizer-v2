import React from 'react';
import { XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import type { CreateDialogMode } from './types';

interface CreateDialogTabBarProps {
  mode: CreateDialogMode;
  onModeChange: (mode: CreateDialogMode) => void;
}

/**
 * Tab bar to switch between "Task" and "Schedule" creation forms.
 */
export function CreateDialogTabBar({
  mode,
  onModeChange,
}: CreateDialogTabBarProps) {
  return (
    <XStack
      borderWidth={1}
      borderColor="$color5"
      borderRadius="$3"
      overflow="hidden"
      alignSelf="stretch"
    >
      <Button
        unstyled
        flex={1}
        onPress={() => onModeChange('task')}
        paddingVertical="$2.5"
        backgroundColor={mode === 'task' ? '$accent8' : 'transparent'}
        justifyContent="center"
        alignItems="center"
      >
        <XStack gap="$2" alignItems="center" justifyContent="center">
          <Feather
            name="check-square"
            size={14}
            color={mode === 'task' ? '#fff' : '#888'}
          />
          <Text
            fontSize="$2"
            fontWeight="700"
            color={mode === 'task' ? '#fff' : '$color8'}
          >
            Task
          </Text>
        </XStack>
      </Button>

      <Button
        unstyled
        flex={1}
        onPress={() => onModeChange('schedule')}
        paddingVertical="$2.5"
        backgroundColor={mode === 'schedule' ? '$accent8' : 'transparent'}
        justifyContent="center"
        alignItems="center"
      >
        <XStack gap="$2" alignItems="center" justifyContent="center">
          <Feather
            name="calendar"
            size={14}
            color={mode === 'schedule' ? '#fff' : '#888'}
          />
          <Text
            fontSize="$2"
            fontWeight="700"
            color={mode === 'schedule' ? '#fff' : '$color8'}
          >
            Schedule
          </Text>
        </XStack>
      </Button>
    </XStack>
  );
}
