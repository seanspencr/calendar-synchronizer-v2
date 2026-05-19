import React from 'react';
import { YStack, XStack, Text, Checkbox, ScrollView } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import type { TaskDto } from './types';

interface TaskListPanelProps {
  tasks: TaskDto[];
  onToggleTask: (id: string) => void;
}

/** Single task item with checkbox and clickable text area */
function TaskItem({
  task,
  onToggle,
  onPress,
}: {
  task: TaskDto;
  onToggle: (id: string) => void;
  onPress: () => void;
}) {
  return (
    <XStack
      gap="$3"
      paddingVertical="$3"
      paddingHorizontal="$3"
      borderBottomWidth={1}
      borderBottomColor="$color3"
      alignItems="flex-start"
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        size="$4"
        borderColor="$color6"
        backgroundColor={task.completed ? '$accent7' : 'transparent'}
      >
        <Checkbox.Indicator>
          <Feather name="check" size={14} color="#fff" />
        </Checkbox.Indicator>
      </Checkbox>

      <YStack
        flex={1}
        gap="$1"
        pressStyle={{ opacity: 0.7 }}
        cursor="pointer"
        onPress={onPress}
      >
        <Text
          fontSize="$3"
          fontWeight="700"
          color="$color12"
          textDecorationLine={task.completed ? 'line-through' : 'none'}
          opacity={task.completed ? 0.5 : 1}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text
            fontSize="$2"
            color="$color8"
            numberOfLines={2}
            opacity={task.completed ? 0.4 : 0.7}
          >
            {task.description}
          </Text>
        ) : null}
      </YStack>
    </XStack>
  );
}

/** Scrollable list of tasks with active count badge */
export function TaskListPanel({ tasks, onToggleTask }: TaskListPanelProps) {
  const router = useRouter();
  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <YStack flex={1}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$3"
        paddingVertical="$3"
      >
        <Text fontSize="$2" fontWeight="700" color="$color10" letterSpacing={1.5}>
          ACTIVE TASKS
        </Text>
        <XStack
          backgroundColor="$color4"
          borderRadius="$2"
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text fontSize="$2" fontWeight="700" color="$color11">
            {String(activeTasks.length).padStart(2, '0')}
          </Text>
        </XStack>
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onPress={() => router.push(`/task/${task.id}`)}
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
