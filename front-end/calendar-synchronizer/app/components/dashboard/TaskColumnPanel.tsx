import React from 'react';
import { YStack, XStack, Text, ScrollView, Button, Checkbox } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import type { TaskDto } from './types';

interface TransferableTaskItemProps {
  task: TaskDto;
  onToggle: (id: string) => void;
  /** Arrow action: commit or uncommit */
  onTransfer: () => void;
  /** Direction of the transfer arrow */
  transferDirection: 'commit' | 'uncommit';
}

/**
 * Task row with a checkbox for status and an arrow button to transfer between panels.
 */
function TransferableTaskItem({
  task,
  onToggle,
  onTransfer,
  transferDirection,
}: TransferableTaskItemProps) {
  const router = useRouter();

  return (
    <XStack
      gap="$2"
      paddingVertical="$2.5"
      paddingHorizontal="$3"
      borderBottomWidth={1}
      borderBottomColor="$color3"
      alignItems="center"
    >
      {/* Transfer arrow on left (All Tasks / commit) */}
      {transferDirection === 'commit' && (
        <Button
          unstyled
          onPress={onTransfer}
          padding="$1"
          pressStyle={{ opacity: 0.6 }}
          cursor="pointer"
        >
          <Feather name="arrow-left" size={14} color="#4ade80" />
        </Button>
      )}

      {/* Completion checkbox */}
      <Checkbox
        id={`col-task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        size="$3"
        borderColor="$color6"
        backgroundColor={task.completed ? '$accent7' : 'transparent'}
      >
        <Checkbox.Indicator>
          <Feather name="check" size={12} color="#fff" />
        </Checkbox.Indicator>
      </Checkbox>

      {/* Clickable task info */}
      <YStack
        flex={1}
        gap="$0.5"
        pressStyle={{ opacity: 0.7 }}
        cursor="pointer"
        onPress={() => router.push(`/task/${task.id}`)}
      >
        <Text
          fontSize="$2"
          fontWeight="700"
          color="$color12"
          textDecorationLine={task.completed ? 'line-through' : 'none'}
          opacity={task.completed ? 0.5 : 1}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.deadline && (
          <Text fontSize={10} color="$color7" numberOfLines={1}>
            Due: {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        )}
      </YStack>

      {/* Transfer arrow on right (Daily Quest / uncommit) */}
      {transferDirection === 'uncommit' && (
        <Button
          unstyled
          onPress={onTransfer}
          padding="$1"
          pressStyle={{ opacity: 0.6 }}
          cursor="pointer"
        >
          <Feather name="arrow-right" size={14} color="#f87171" />
        </Button>
      )}
    </XStack>
  );
}

interface TaskColumnPanelProps {
  title: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
  tasks: TaskDto[];
  onToggle: (id: string) => void;
  onTransfer: (id: string) => void;
  transferDirection: 'commit' | 'uncommit';
  emptyMessage: string;
}

/**
 * A single column panel showing tasks with transfer buttons.
 * Used for both "Daily Quest" and "All Tasks" columns.
 */
export function TaskColumnPanel({
  title,
  icon,
  iconColor,
  tasks,
  onToggle,
  onTransfer,
  transferDirection,
  emptyMessage,
}: TaskColumnPanelProps) {
  return (
    <YStack
      flex={1}
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color4"
      overflow="hidden"
    >
      {/* Column header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$3"
        paddingVertical="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$color3"
      >
        <XStack alignItems="center" gap="$2">
          <Feather name={icon} size={14} color={iconColor} />
          <Text
            fontSize={11}
            fontWeight="700"
            color="$color8"
            letterSpacing={1.5}
            textTransform="uppercase"
          >
            {title}
          </Text>
        </XStack>

        <XStack
          backgroundColor="$color4"
          borderRadius="$2"
          paddingHorizontal="$2"
          paddingVertical="$0.5"
        >
          <Text fontSize={11} fontWeight="700" color="$color11">
            {String(tasks.length).padStart(2, '0')}
          </Text>
        </XStack>
      </XStack>

      {/* Task list */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <YStack padding="$4" alignItems="center">
            <Text fontSize="$2" color="$color7" fontStyle="italic">
              {emptyMessage}
            </Text>
          </YStack>
        ) : (
          tasks.map((task) => (
            <TransferableTaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onTransfer={() => onTransfer(task.id)}
              transferDirection={transferDirection}
            />
          ))
        )}
      </ScrollView>
    </YStack>
  );
}
