import React, { useState, useCallback } from 'react';
import { YStack, XStack, ScrollView, Text, Spinner, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetTaskDetail } from '../../hooks/task/useGetTaskDetail';
import { useUpdateTask } from '../../hooks/task/useUpdateTask';
import { useToggleSubtask } from '../../hooks/task/useToggleSubtask';
import {
  TaskDetailHeader,
  TaskDescription,
  SubtaskList,
  TaskInfoBar,
  TaskEditForm,
} from '../../components/task-detail';
import type { TaskEditFormData } from '../../components/task-detail';

/** Format an ISO date string to a human-readable date + time */
function formatDeadline(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date} — ${time}`;
}

/**
 * Task Detail screen — accessible at /task/:id.
 * Displays task information in read mode with edit toggle,
 * subtask checkboxes, and a clickable parent task link.
 */
export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { task, setTask, isLoading, error } = useGetTaskDetail(id ?? '');
  const { updateTask, isLoading: isSaving, error: saveError, successMessage: saveSuccess } = useUpdateTask(setTask, id);
  const { toggleSubtask, error: subtaskError } = useToggleSubtask(setTask);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TaskEditFormData>({
    title: '',
    description: '',
    deadline: '',
    completed: false,
  });

  /** Populate form data when entering edit mode */
  const handleEditToggle = useCallback(() => {
    if (!isEditing && task) {
      setFormData({
        title: task.title,
        description: task.description ?? '',
        deadline: task.deadline ?? '',
        completed: task.completed,
      });
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, task]);

  /** Update a single form field */
  const handleFieldChange = useCallback(
    <K extends keyof TaskEditFormData>(
      field: K,
      value: TaskEditFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Save changes and exit edit mode */
  const handleSave = useCallback(async () => {
    await updateTask(formData);
    setIsEditing(false);
  }, [formData, updateTask]);

  /** Navigate to parent task */
  const handleParentTaskPress = useCallback(() => {
    if (task?.parent_task_id) {
      router.push(`/task/${task.parent_task_id}`);
    }
  }, [task, router]);

  // Loading state
  if (isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor="$color1"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="large" color="$accent8" />
        <Text marginTop="$3" color="$color8">
          Loading task...
        </Text>
      </YStack>
    );
  }

  // Error state
  if (error || !task) {
    return (
      <YStack
        flex={1}
        backgroundColor="$color1"
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <Text fontSize="$5" fontWeight="700" color="$color12">
          Task not found
        </Text>
        <Text marginTop="$2" color="$color8" textAlign="center">
          {error ?? 'The requested task could not be loaded.'}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$color1">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 24,
          maxWidth: 800,
          width: '100%',
          alignSelf: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back navigation */}
        <Button
          unstyled
          onPress={() => router.back()}
          alignSelf="flex-start"
          paddingVertical="$2"
          paddingRight="$2"
          marginBottom="$2"
          pressStyle={{ opacity: 0.6 }}
          cursor="pointer"
        >
          <XStack alignItems="center" gap="$2">
            <Feather name="arrow-left" size={20} color="#aaa" />
            <Text fontSize="$3" color="$color8">
              Back
            </Text>
          </XStack>
        </Button>

        {/* Header: title + edit/save buttons */}
        <TaskDetailHeader
          title={task.title}
          isEditing={isEditing}
          onEditPress={handleEditToggle}
          onSave={handleSave}
        />

        {/* Read mode content */}
        {!isEditing && (
          <>
            {/* Description */}
            <TaskDescription
              description={task.description ?? 'No description provided.'}
            />

            {/* Subtasks */}
            <SubtaskList
              subtasks={task.subtasks}
              onToggle={toggleSubtask}
            />

            {/* Info bar: deadline + parent task */}
            {task.deadline && (
              <TaskInfoBar
                deadline={formatDeadline(task.deadline)}
                parentTaskTitle={task.parent_task_title}
                parentTaskId={task.parent_task_id}
                onParentTaskPress={
                  task.parent_task_id ? handleParentTaskPress : undefined
                }
              />
            )}
          </>
        )}

        {/* Edit mode content */}
        {isEditing && (
          <YStack gap="$3">
            <TaskEditForm
              formData={formData}
              onFieldChange={handleFieldChange}
            />

            {/* Save feedback */}
            {isSaving && (
              <XStack alignItems="center" gap="$2" marginTop="$1">
                <Spinner size="small" color="$accent8" />
                <Text fontSize="$2" color="$color8">Saving...</Text>
              </XStack>
            )}
            {saveError && (
              <Text fontSize="$2" color="#f87171" marginTop="$1">{saveError}</Text>
            )}
            {saveSuccess && !isSaving && (
              <Text fontSize="$2" color="#4ade80" marginTop="$1">{saveSuccess}</Text>
            )}
          </YStack>
        )}

        {/* Inline action errors */}
        {subtaskError && (
          <Text fontSize="$2" color="#f87171" marginTop="$3">
            {subtaskError}
          </Text>
        )}
      </ScrollView>
    </YStack>
  );
}
