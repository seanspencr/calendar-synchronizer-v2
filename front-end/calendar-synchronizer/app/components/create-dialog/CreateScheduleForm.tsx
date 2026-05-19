import React from 'react';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
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

const PROVIDER_OPTIONS: { value: ScheduleProvider; label: string }[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'google', label: 'Google' },
  { value: 'microsoft', label: 'Microsoft' },
];

interface ProviderPickerProps {
  value: ScheduleProvider;
  onChange: (provider: ScheduleProvider) => void;
}

/** Pill selector for schedule provider */
function ProviderPicker({ value, onChange }: ProviderPickerProps) {
  return (
    <XStack gap="$2">
      {PROVIDER_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <Button
            key={opt.value}
            size="$2"
            backgroundColor={isSelected ? '$accent8' : '$color3'}
            borderRadius="$3"
            borderWidth={1}
            borderColor={isSelected ? '$accent9' : '$color5'}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onChange(opt.value)}
          >
            <Text
              fontSize="$1"
              fontWeight="600"
              color={isSelected ? '#fff' : '$color10'}
            >
              {opt.label}
            </Text>
          </Button>
        );
      })}
    </XStack>
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

      <FormField label="Event Date">
        <Input
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

      <FormField label="Provider">
        <ProviderPicker
          value={formData.schedule_provider}
          onChange={(p) => onFieldChange('schedule_provider', p)}
        />
      </FormField>
    </YStack>
  );
}
