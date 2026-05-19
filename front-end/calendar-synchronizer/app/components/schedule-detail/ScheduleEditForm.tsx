import React from 'react';
import { YStack, XStack, Text, Input, TextArea, Button, Label } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import type {
  RecurrenceInterval,
  ScheduleEditFormData,
  RECURRENCE_LABELS,
} from './types';

const RECURRENCE_OPTIONS: { value: RecurrenceInterval; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

/** Reusable labeled form field wrapper */
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

interface RecurrencePickerProps {
  value: RecurrenceInterval;
  onChange: (interval: RecurrenceInterval) => void;
}

/** Inline pill selector for recurrence intervals */
function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  return (
    <XStack gap="$2" flexWrap="wrap">
      {RECURRENCE_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            key={option.value}
            size="$2"
            backgroundColor={isSelected ? '$accent8' : '$color3'}
            borderRadius="$3"
            borderWidth={1}
            borderColor={isSelected ? '$accent9' : '$color5'}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onChange(option.value)}
          >
            <Text
              fontSize="$1"
              fontWeight="600"
              color={isSelected ? '#fff' : '$color10'}
            >
              {option.label}
            </Text>
          </Button>
        );
      })}
    </XStack>
  );
}

interface ScheduleEditFormProps {
  formData: ScheduleEditFormData;
  onFieldChange: <K extends keyof ScheduleEditFormData>(
    field: K,
    value: ScheduleEditFormData[K],
  ) => void;
  onSave: () => void;
}

/**
 * Full edit form for schedule details.
 * Renders input fields for title, description, date/time, location, and recurrence.
 */
export function ScheduleEditForm({
  formData,
  onFieldChange,
  onSave,
}: ScheduleEditFormProps) {
  /** Format ISO string to datetime-local input value (YYYY-MM-DDTHH:MM) */
  const toDateTimeLocal = (iso: string): string => {
    try {
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return iso;
    }
  };

  return (
    <YStack
      gap="$4"
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color4"
      padding="$4"
      marginTop="$3"
    >
      <Text fontSize="$5" fontWeight="700" color="$color12">
        Edit Schedule
      </Text>

      {/* Title */}
      <FormField label="Title">
        <Input
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.title}
          onChangeText={(text) => onFieldChange('title', text)}
          placeholder="Event title"
          placeholderTextColor="$color7"
        />
      </FormField>

      {/* Description */}
      <FormField label="Description">
        <TextArea
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.description}
          onChangeText={(text) => onFieldChange('description', text)}
          placeholder="Event description"
          placeholderTextColor="$color7"
          numberOfLines={5}
          minHeight={120}
        />
      </FormField>

      {/* Date & Time */}
      <XStack gap="$3" flexWrap="wrap">
        <YStack flex={1} minWidth={200}>
          <FormField label="Start Time">
            <Input
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={toDateTimeLocal(formData.startTime)}
              onChangeText={(text) => onFieldChange('startTime', text)}
              placeholder="YYYY-MM-DDTHH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>

        <YStack flex={1} minWidth={200}>
          <FormField label="End Time">
            <Input
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={toDateTimeLocal(formData.endTime)}
              onChangeText={(text) => onFieldChange('endTime', text)}
              placeholder="YYYY-MM-DDTHH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>
      </XStack>

      {/* Location */}
      <FormField label="Location">
        <Input
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.location}
          onChangeText={(text) => onFieldChange('location', text)}
          placeholder="Event location"
          placeholderTextColor="$color7"
        />
      </FormField>

      {/* Recurrence */}
      <FormField label="Recurrence">
        <RecurrencePicker
          value={formData.recurrenceInterval}
          onChange={(interval) => onFieldChange('recurrenceInterval', interval)}
        />
      </FormField>

      {/* Repeat Count (only visible when recurrence is set) */}
      {formData.recurrenceInterval !== 'none' && (
        <FormField label="Repeat Every N Intervals">
          <Input
            size="$4"
            backgroundColor="$color3"
            borderColor="$color5"
            color="$color12"
            value={String(formData.recurrenceCount)}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              onFieldChange('recurrenceCount', isNaN(num) ? 1 : num);
            }}
            placeholder="1"
            placeholderTextColor="$color7"
            keyboardType="numeric"
            maxWidth={120}
          />
        </FormField>
      )}

      {/* Save Button */}
      <Button
        size="$4"
        backgroundColor="$accent8"
        borderRadius="$3"
        pressStyle={{ opacity: 0.85, backgroundColor: '$accent9' }}
        onPress={onSave}
        icon={<Feather name="check" size={16} color="#fff" />}
        alignSelf="flex-start"
        marginTop="$2"
      >
        <Text fontSize="$3" fontWeight="700" color="#fff">
          Save Changes
        </Text>
      </Button>
    </YStack>
  );
}
