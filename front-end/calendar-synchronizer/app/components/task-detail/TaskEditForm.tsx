import React from 'react';
import { YStack, XStack, Text, Input, TextArea, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import type { TaskEditFormData } from './types';

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

interface TaskEditFormProps {
  formData: TaskEditFormData;
  onFieldChange: <K extends keyof TaskEditFormData>(
    field: K,
    value: TaskEditFormData[K],
  ) => void;
}

/**
 * Edit form for task details.
 * Renders input fields for title, description, and deadline.
 */
export function TaskEditForm({ formData, onFieldChange }: TaskEditFormProps) {
  /** Format ISO string to datetime-local input value */
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
        Edit Task
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
          placeholder="Task title"
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
          placeholder="Task description"
          placeholderTextColor="$color7"
          numberOfLines={6}
          minHeight={150}
        />
      </FormField>

      {/* Deadline */}
      <FormField label="Deadline">
        <Input
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={toDateTimeLocal(formData.deadline)}
          onChangeText={(text) => onFieldChange('deadline', text)}
          placeholder="YYYY-MM-DDTHH:MM"
          placeholderTextColor="$color7"
          maxWidth={300}
        />
      </FormField>
    </YStack>
  );
}
