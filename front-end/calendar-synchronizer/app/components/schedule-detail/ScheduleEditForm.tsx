import React from 'react';
import { YStack, XStack, Text, Input, TextArea, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import type { ScheduleEditFormData, RecurrencePeriod } from './types';
import { RECURRENCE_PERIOD_LABELS } from './types';

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

const PERIOD_OPTIONS: RecurrencePeriod[] = ['NONE', 'DAY', 'WEEK', 'MONTH', 'YEAR'];

interface PeriodPickerProps {
  value: RecurrencePeriod;
  onChange: (period: RecurrencePeriod) => void;
}

/** Inline pill selector for recurrence period */
function PeriodPicker({ value, onChange }: PeriodPickerProps) {
  return (
    <XStack gap="$2" flexWrap="wrap">
      {PERIOD_OPTIONS.map((period) => {
        const isSelected = value === period;
        return (
          <Button
            key={period}
            size="$2"
            backgroundColor={isSelected ? '$accent8' : '$color3'}
            borderRadius="$3"
            borderWidth={1}
            borderColor={isSelected ? '$accent9' : '$color5'}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onChange(period)}
          >
            <Text
              fontSize="$1"
              fontWeight="600"
              color={isSelected ? '#fff' : '$color10'}
            >
              {RECURRENCE_PERIOD_LABELS[period]}
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
 * Edit form for schedule details.
 * Fields: event (title), description, start_time, end_time,
 * recurrence_interval (int), recurrence_period (DAY/WEEK/MONTH/YEAR).
 */
export function ScheduleEditForm({
  formData,
  onFieldChange,
  onSave,
}: ScheduleEditFormProps) {
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

      {/* Date */}
      <FormField label="Event Date">
        <Input
          type="date"
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.eventDate}
          onChangeText={(text) => onFieldChange('eventDate', text)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="$color7"
        />
      </FormField>

      {/* Time */}
      <XStack gap="$3" flexWrap="wrap">
        <YStack flex={1} minWidth={200}>
          <FormField label="Start Time">
            <Input
              type="time"
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={formData.startTime}
              onChangeText={(text) => onFieldChange('startTime', text)}
              placeholder="HH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>

        <YStack flex={1} minWidth={200}>
          <FormField label="End Time">
            <Input
              type="time"
              size="$4"
              backgroundColor="$color3"
              borderColor="$color5"
              color="$color12"
              value={formData.endTime}
              onChangeText={(text) => onFieldChange('endTime', text)}
              placeholder="HH:MM"
              placeholderTextColor="$color7"
            />
          </FormField>
        </YStack>
      </XStack>

      {/* Recurrence */}
      <XStack gap="$3" alignItems="flex-end" flexWrap="wrap">
        <YStack flex={1} minWidth={200}>
          <FormField label="Repeat Pattern">
            <PeriodPicker
              value={formData.recurrencePeriod}
              onChange={(p) => onFieldChange('recurrencePeriod', p)}
            />
          </FormField>
        </YStack>

        {formData.recurrencePeriod !== 'NONE' && (
          <YStack minWidth={120}>
            <FormField label="Every">
              <Input
                size="$4"
                backgroundColor="$color3"
                borderColor="$color5"
                color="$color12"
                value={String(formData.recurrenceInterval)}
                onChangeText={(text) => {
                  const n = parseInt(text, 10);
                  onFieldChange('recurrenceInterval', isNaN(n) || n < 0 ? 0 : n);
                }}
                placeholder="Number"
                placeholderTextColor="$color7"
                keyboardType="numeric"
              />
            </FormField>
          </YStack>
        )}
      </XStack>

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
