import React, { useState, useCallback, useEffect } from 'react';
import { YStack, XStack, Text, Button, ScrollView } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { CreateDialogTabBar } from './CreateDialogTabBar';
import { CreateTaskForm } from './CreateTaskForm';
import { CreateScheduleForm } from './CreateScheduleForm';
import { useCreateTask } from '../../hooks/task/useCreateTask';
import { useCreateSchedule } from '../../hooks/schedule/useCreateSchedule';
import type {
  CreateDialogMode,
  CreateTaskFormData,
  CreateScheduleFormData,
} from './types';
import { ScheduleDto, TaskDto } from '../../api-client';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleDto[]>>;
  /** When set, the dialog opens locked to 'task' mode with this id as parent_task_id */
  initialParentTaskId?: string;
  /** Display name of the parent task for the badge */
  initialParentTaskTitle?: string;
}

const makeInitialTask = (parentTaskId?: string): CreateTaskFormData => ({
  title: '',
  description: '',
  deadline: '',
  parent_task_id: parentTaskId,
});

const INITIAL_SCHEDULE: CreateScheduleFormData = {
  event: '',
  description: '',
  event_date: '',
  start_time: '',
  end_time: '',
  schedule_provider: 'LOCAL',
};

/**
 * Modal dialog for creating a new Task or Schedule.
 * Renders as an overlay with a backdrop.
 * When `initialParentTaskId` is supplied the dialog is locked to task mode
 * and the new task will be created as a subtask.
 */
export function CreateDialog({
  open,
  onClose,
  setTasks,
  setSchedules,
  initialParentTaskId,
  initialParentTaskTitle,
}: CreateDialogProps) {
  const isSubtaskMode = Boolean(initialParentTaskId);
  const [mode, setMode] = useState<CreateDialogMode>('task');
  const [taskForm, setTaskForm] = useState<CreateTaskFormData>(makeInitialTask(initialParentTaskId));
  const [scheduleForm, setScheduleForm] = useState<CreateScheduleFormData>(INITIAL_SCHEDULE);

  // Re-initialise the task form whenever the parent task changes (i.e. context menu target changes)
  useEffect(() => {
    setTaskForm(makeInitialTask(initialParentTaskId));
    if (isSubtaskMode) setMode('task');
  }, [initialParentTaskId, isSubtaskMode]);

  const { createTask, isSubmitting: isSubmittingTask, error: taskError, successMessage: taskSuccess } = useCreateTask(setTasks);
  const { createSchedule, isSubmitting: isSubmittingSchedule, error: scheduleError, successMessage: scheduleSuccess } = useCreateSchedule();

  const isSubmitting = isSubmittingTask || isSubmittingSchedule;
  const error = mode === 'task' ? taskError : scheduleError;
  const successMessage = mode === 'task' ? taskSuccess : scheduleSuccess;

  /** Reset forms and close */
  const handleClose = useCallback(() => {
    setTaskForm(makeInitialTask(initialParentTaskId));
    setScheduleForm(INITIAL_SCHEDULE);
    onClose();
  }, [onClose, initialParentTaskId]);

  /** Update a task form field */
  const handleTaskFieldChange = useCallback(
    <K extends keyof CreateTaskFormData>(
      field: K,
      value: CreateTaskFormData[K],
    ) => {
      setTaskForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Update a schedule form field */
  const handleScheduleFieldChange = useCallback(
    <K extends keyof CreateScheduleFormData>(
      field: K,
      value: CreateScheduleFormData[K],
    ) => {
      setScheduleForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Submit the active form */
  const handleSubmit = useCallback(async () => {
    if (mode === 'task') {
      await createTask(taskForm);
    } else {
      await createSchedule(scheduleForm);
    }
    // Auto-close on success after a short delay
    setTimeout(() => handleClose(), 800);
  }, [mode, taskForm, scheduleForm, createTask, createSchedule, handleClose]);

  if (!open) return null;

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      justifyContent="center"
      alignItems="center"
      zIndex={1000}
    >
      {/* Backdrop */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0,0,0,0.6)"
        onPress={handleClose}
      />

      {/* Dialog card */}
      <YStack
        backgroundColor="$color1"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color4"
        width="90%"
        maxWidth={480}
        maxHeight="80%"
        zIndex={1001}
        overflow="hidden"
      >
        {/* Dialog header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$color3"
        >
          <YStack gap="$1">
            <Text fontSize="$5" fontWeight="700" color="$color12">
              {isSubtaskMode ? 'Add Subtask' : 'Create New'}
            </Text>
            {isSubtaskMode && initialParentTaskTitle && (
              <XStack alignItems="center" gap="$1.5">
                <Feather name="corner-down-right" size={11} color="#888" />
                <Text fontSize={11} color="$color7" numberOfLines={1}>
                  {initialParentTaskTitle}
                </Text>
              </XStack>
            )}
          </YStack>
          <Button
            unstyled
            onPress={handleClose}
            padding="$1"
            pressStyle={{ opacity: 0.6 }}
            cursor="pointer"
          >
            <Feather name="x" size={20} color="#888" />
          </Button>
        </XStack>

        {/* Dialog body */}
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Mode switcher — hidden in subtask mode */}
          {!isSubtaskMode && (
            <CreateDialogTabBar mode={mode} onModeChange={setMode} />
          )}

          {/* Form */}
          <YStack marginTop={isSubtaskMode ? 0 : '$4'}>
            {mode === 'task' ? (
              <CreateTaskForm
                formData={taskForm}
                onFieldChange={handleTaskFieldChange}
              />
            ) : (
              <CreateScheduleForm
                formData={scheduleForm}
                onFieldChange={handleScheduleFieldChange}
              />
            )}
          </YStack>

          {/* Error / Success */}
          {error && (
            <Text fontSize="$2" color="#f87171" marginTop="$3">
              {error}
            </Text>
          )}
          {successMessage && (
            <Text fontSize="$2" color="#4ade80" marginTop="$3">
              {successMessage}
            </Text>
          )}

          {/* Submit button */}
          <Button
            size="$4"
            backgroundColor="$accent8"
            borderRadius="$3"
            pressStyle={{ opacity: 0.85, backgroundColor: '$accent9' }}
            onPress={handleSubmit}
            disabled={isSubmitting}
            opacity={isSubmitting ? 0.6 : 1}
            icon={
              <Feather
                name={isSubmitting ? 'loader' : 'plus'}
                size={16}
                color="#fff"
              />
            }
            marginTop="$4"
          >
            <Text fontSize="$3" fontWeight="700" color="#fff">
              {isSubmitting
                ? 'Creating...'
                : isSubtaskMode
                  ? 'Add Subtask'
                  : mode === 'task'
                    ? 'Create Task'
                    : 'Create Schedule'}
            </Text>
          </Button>
        </ScrollView>
      </YStack>
    </YStack>
  );
}
