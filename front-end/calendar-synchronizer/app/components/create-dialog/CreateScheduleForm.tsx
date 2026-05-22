import React from 'react';
import { YStack, XStack, Text, Input, TextArea } from 'tamagui';
import type { CreateScheduleFormData, ScheduleProvider } from './types';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <YStack gap="$1.5">
      <Text
        fontSize={11}
        fontWeight="700"
        color="$color8"
        letterSpacing={1}
        textTransform="uppercase"
      >
        {label}
      </Text>
      {children}
    </YStack>
  );
}

interface CreateScheduleFormProps {
  formData: CreateScheduleFormData;
  onFieldChange: <K extends keyof CreateScheduleFormData>(
    field: K,
    value: CreateScheduleFormData[K],
  ) => void;
}

/**
 * Form fields for creating a new schedule/event.
 */
export function CreateScheduleForm({
  formData,
  onFieldChange,
}: CreateScheduleFormProps) {
  return (
    <YStack gap="$3">
      <FormField label="Event Name">
        <Input
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.event}
          onChangeText={(t) => onFieldChange('event', t)}
          placeholder="Event title"
          placeholderTextColor="$color7"
        />
      </FormField>

      <FormField label="Description">
        <TextArea
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.description}
          onChangeText={(t) => onFieldChange('description', t)}
          placeholder="Event description (optional)"
          placeholderTextColor="$color7"
          numberOfLines={3}
          minHeight={80}
        />
      </FormField>

      <FormField label="Event Date">
        <Input
          type="date"
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.event_date}
          onChangeText={(t) => onFieldChange('event_date', t)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="$color7"
        />
      </FormField>

      <XStack gap="$3">
        <YStack flex={1}>
          <FormField label="Start Time">
            <Input
              type="time"
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={formData.start_time}
              onChangeText={(t) => onFieldChange('start_time', t)}
              placeholder="HH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>
        <YStack flex={1}>
          <FormField label="End Time">
            <Input
              type="time"
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={formData.end_time}
              onChangeText={(t) => onFieldChange('end_time', t)}
              placeholder="HH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>
      </XStack>

    </YStack>
  );
}
