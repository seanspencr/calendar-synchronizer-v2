import React from 'react';
import { YStack, XStack, Text, Checkbox } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import type { TaskDto } from '../../api-client';

interface SubtaskListProps {
  subtasks?: TaskDto[];
  onToggle: (id: string) => void;
}

/** A single subtask row with a checkbox and clickable title */
function SubtaskItem({
  subtask,
  onToggle,
  onPress,
}: {
  subtask: TaskDto;
  onToggle: (id: string) => void;
  onPress: () => void;
}) {
  return (
    <XStack
      gap="$3"
      paddingVertical="$2.5"
      paddingHorizontal="$3"
      alignItems="center"
    >
      <Checkbox
        id={`subtask-${subtask.id}`}
        checked={subtask.completed}
        onCheckedChange={() => onToggle(subtask.id)}
        size="$4"
        borderColor="$color6"
        backgroundColor={subtask.completed ? '$accent7' : 'transparent'}
      >
        <Checkbox.Indicator>
          <Feather name="check" size={14} color="#fff" />
        </Checkbox.Indicator>
      </Checkbox>

      <Text
        fontSize="$3"
        fontWeight="600"
        color="$color12"
        textDecorationLine={subtask.completed ? 'line-through' : 'none'}
        opacity={subtask.completed ? 0.5 : 1}
        flex={1}
        pressStyle={{ opacity: 0.7 }}
        cursor="pointer"
        onPress={onPress}
      >
        {subtask.title}
      </Text>
    </XStack>
  );
}

/**
 * Displays a list of subtasks with toggleable checkboxes.
 * Each subtask title links to its own task detail page.
 */
export function SubtaskList({ subtasks = [], onToggle }: SubtaskListProps) {
  const router = useRouter();

  if (subtasks.length === 0) return null;

  return (
    <YStack gap="$2" marginTop="$5">
      <Text
        fontSize={11}
        fontWeight="700"
        color="$color8"
        letterSpacing={1.5}
        textTransform="uppercase"
      >
        Subtasks
      </Text>

      <YStack
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color4"
        overflow="hidden"
      >
        {subtasks.map((subtask, index) => (
          <YStack
            key={subtask.id}
            borderBottomWidth={index < subtasks.length - 1 ? 1 : 0}
            borderBottomColor="$color3"
          >
            <SubtaskItem
              subtask={subtask}
              onToggle={onToggle}
              onPress={() => router.push(`/task/${subtask.id}`)}
            />
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
