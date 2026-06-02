import React, { useState, useCallback } from 'react';
import { YStack, XStack, ScrollView, Text, Spinner, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetScheduleDetail } from '../../hooks/schedule/useGetScheduleDetail';
import { useUpdateSchedule } from '../../hooks/schedule/useUpdateSchedule';
import {
  ScheduleDetailHeader,
  ScheduleInfoBar,
  ScheduleDescription,
  ScheduleEditForm,
} from '../../components/schedule-detail';
import type { ScheduleEditFormData, RecurrencePeriod } from '../../components/schedule-detail';

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

function extractDateStr(iso?: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return '';
  }
}

function extractTimeStr(iso?: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
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
    eventDate: '',
    startTime: '',
    endTime: '',
    recurrenceInterval: 1,
    recurrencePeriod: 'NONE',
  });

  /** Populate form data when entering edit mode */
  const handleEditToggle = useCallback(() => {
    if (!isEditing && schedule) {
      setFormData({
        title: schedule.event ?? '',
        description: schedule.description ?? '',
        eventDate: extractDateStr(schedule.event_date || schedule.start_time),
        startTime: extractTimeStr(schedule.start_time),
        endTime: extractTimeStr(schedule.end_time),
        recurrenceInterval: schedule.recurrence?.recurrence_interval ?? 1,
        recurrencePeriod: (schedule.recurrence?.recurrence_period as RecurrencePeriod) ?? 'NONE',
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
    if (!schedule) return;

    let isoStart = schedule.start_time;
    let isoEnd = schedule.end_time;
    try {
      if (formData.eventDate && formData.startTime) {
        isoStart = new Date(`${formData.eventDate}T${formData.startTime}`).toISOString();
      }
      if (formData.eventDate && formData.endTime) {
        isoEnd = new Date(`${formData.eventDate}T${formData.endTime}`).toISOString();
      }
    } catch (e) {
      console.warn("Error parsing form dates", e);
    }

    updateSchedule(schedule.id, {
      event: formData.title,
      event_date: formData.eventDate ? new Date(formData.eventDate).toISOString() : isoStart,
      start_time: isoStart,
      end_time: isoEnd,
      description: formData.description,
      recurrence: formData.recurrencePeriod === 'NONE' ? null : {
        recurrence_interval: formData.recurrenceInterval,
        recurrence_period: formData.recurrencePeriod,
      },
    } as any);
    setIsEditing(false);
  }, [formData, schedule, updateSchedule]);

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
          title={schedule.event ?? 'Untitled Event'}
          isEditing={isEditing}
          onEditPress={handleEditToggle}
        />

        {/* Info bar (read mode only) */}
        {!isEditing && (
          <YStack marginTop="$4">
            <ScheduleInfoBar
              date={formatDate(schedule.event_date)}
              timeRange={`${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`}
              recurrenceLabel={schedule.recurrence ? `${schedule.recurrence?.recurrence_interval} ${schedule.recurrence?.recurrence_period}` : "Not Repeating"}
            />
          </YStack>
        )}

        {/* Description (read mode only) */}
        {!isEditing && (
          <ScheduleDescription
            description={schedule.description ?? 'No description.'}
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
