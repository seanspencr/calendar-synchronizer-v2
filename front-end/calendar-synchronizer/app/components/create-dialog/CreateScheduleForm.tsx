import React, { useState } from 'react';
import { YStack, XStack, Text, Input, TextArea } from 'tamagui';
import type { CreateScheduleFormData, ScheduleProvider } from './types';
import { RecurrenceDtoRecurrencePeriodEnum } from '@/app/api-client';

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


  const [isRepeating, setIsRepeating] = useState(false);
  const recurrencePeriods = Object.values(RecurrenceDtoRecurrencePeriodEnum);

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



       {/* ── Repeating toggle ── */}
      <XStack
        alignItems="center"
        gap="$2"
        onPress={() => {
          const next = !isRepeating;
          setIsRepeating(next);
          // Clear recurrence fields when unchecking
          if (!next) {
            onFieldChange('recurrence_interval', 0);
            onFieldChange('recurrence_period', undefined);
          }
        }}
        cursor="pointer"
        hitSlop={8}
      >
        <XStack
          width={18}
          height={18}
          borderRadius="$1"
          borderWidth={2}
          borderColor={isRepeating ? '$blue9' : '$color7'}
          backgroundColor={isRepeating ? '$blue9' : 'transparent'}
          alignItems="center"
          justifyContent="center"
        >
          {isRepeating && (
            <Text fontSize={11} color="white" fontWeight="700" lineHeight={14}>
              ✓
            </Text>
          )}
        </XStack>
        <Text fontSize={14} color="$color11" userSelect="none">
          Event is repeating
        </Text>
      </XStack>

            {/* ── Recurrence fields (conditional) ── */}
      {isRepeating && (
        <XStack gap="$3">
          <YStack flex={1}>
            <FormField label="Repeat Every">
              <Input
                size="$4"
                backgroundColor="$color3"
                borderColor="$color5"
                color="$color12"
                value={
                  formData.recurrence_interval
                    ? formData.recurrence_interval.toString()
                    : ''
                }
                onChangeText={(t) =>
                  onFieldChange('recurrence_interval', parseInt(t) || 0)
                }
                placeholder="1"
                placeholderTextColor="$color7"
                keyboardType="numeric"
              />
            </FormField>
          </YStack>

          <YStack flex={1}>
            <FormField label="Period">
              {/* Native <select> wrapped to match Input styling */}
              <XStack
                size="$4"
                backgroundColor="$color3"
                borderColor="$color5"
                borderWidth={1}
                borderRadius="$3"
                paddingHorizontal="$3"
                height={44}
                alignItems="center"
              >
                <select
                  value={formData.recurrence_period ?? ''}
                  onChange={(e) =>
                    onFieldChange(
                      'recurrence_period',
                      e.target.value as RecurrenceDtoRecurrencePeriodEnum,
                    )
                  }
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'inherit',
                    fontSize: 14,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="" disabled>
                    Select period
                  </option>
                  {recurrencePeriods.map((period) => (
                    <option key={period} value={period}>
                      {period.charAt(0).toUpperCase() + period.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </XStack>
            </FormField>
          </YStack>
        </XStack>
      )}

    </YStack>
  );
}
