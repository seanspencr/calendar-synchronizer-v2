import React, { useState, useCallback } from 'react';
import { YStack, XStack, ScrollView, Text, Spinner, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetScheduleDetail } from '../../hooks/useGetScheduleDetail';
import { useUpdateSchedule } from '../../hooks/useUpdateSchedule';
import {
  ScheduleDetailHeader,
  ScheduleInfoBar,
  ScheduleDescription,
  ScheduleEditForm,
  RECURRENCE_LABELS,
} from '../../components/schedule-detail';
import type {
  ScheduleEditFormData,
  RecurrenceInterval,
} from '../../components/schedule-detail';

/** Format an ISO date string to a human-readable date (e.g. "Oct 24, 2024") */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format an ISO date string to a human-readable time (e.g. "09:00 AM") */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/** Build the recurrence display label */
function buildRecurrenceLabel(
  interval: RecurrenceInterval,
  count?: number,
): string {
  if (interval === 'none') return 'No recurrence';
  const label = RECURRENCE_LABELS[interval];
  const n = count && count > 1 ? count : 1;
  return n > 1 ? `Repeat every ${n} ${label}s` : `Repeat every ${label}`;
}

/**
 * Schedule Detail screen — accessible at /schedule/:id.
 * Displays schedule information in read mode with an edit toggle.
 */
export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { schedule, setSchedule, isLoading, error } = useGetScheduleDetail(id ?? '');
  const { updateSchedule } = useUpdateSchedule(setSchedule);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ScheduleEditFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    recurrenceInterval: 'none',
    recurrenceCount: 1,
  });

  /** Populate form data when entering edit mode */
  const handleEditToggle = useCallback(() => {
    if (!isEditing && schedule) {
      setFormData({
        title: schedule.title,
        description: schedule.description ?? '',
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location ?? '',
        recurrenceInterval: schedule.recurrenceInterval,
        recurrenceCount: schedule.recurrenceCount ?? 1,
      });
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, schedule]);

  /** Update a single form field */
  const handleFieldChange = useCallback(
    <K extends keyof ScheduleEditFormData>(
      field: K,
      value: ScheduleEditFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Save changes and exit edit mode */
  const handleSave = useCallback(() => {
    updateSchedule(formData);
    setIsEditing(false);
  }, [formData, updateSchedule]);

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
          Loading schedule...
        </Text>
      </YStack>
    );
  }

  // Error state
  if (error || !schedule) {
    return (
      <YStack
        flex={1}
        backgroundColor="$color1"
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <Text fontSize="$5" fontWeight="700" color="$color12">
          Schedule not found
        </Text>
        <Text marginTop="$2" color="$color8" textAlign="center">
          {error ?? 'The requested schedule could not be loaded.'}
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

        {/* Header: title + edit button */}
        <ScheduleDetailHeader
          title={schedule.title}
          isEditing={isEditing}
          onEditPress={handleEditToggle}
        />

        {/* Info bar (read mode only) */}
        {!isEditing && (
          <YStack marginTop="$4">
            <ScheduleInfoBar
              date={formatDate(schedule.startTime)}
              timeRange={`${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`}
              recurrenceLabel={buildRecurrenceLabel(
                schedule.recurrenceInterval,
                schedule.recurrenceCount,
              )}
            />
          </YStack>
        )}

        {/* Description (read mode only) */}
        {!isEditing && (
          <ScheduleDescription
            description={schedule.description ?? 'No description provided.'}
          />
        )}

        {/* Edit form (edit mode only) */}
        {isEditing && (
          <ScheduleEditForm
            formData={formData}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
          />
        )}
      </ScrollView>
    </YStack>
  );
}
