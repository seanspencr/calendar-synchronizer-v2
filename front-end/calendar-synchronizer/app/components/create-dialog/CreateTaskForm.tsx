import React from 'react';
import { YStack, Text, Input, TextArea } from 'tamagui';
import type { CreateTaskFormData } from './types';

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

interface CreateTaskFormProps {
  formData: CreateTaskFormData;
  onFieldChange: <K extends keyof CreateTaskFormData>(
    field: K,
    value: CreateTaskFormData[K],
  ) => void;
}

/**
 * Form fields for creating a new task.
 */
export function CreateTaskForm({
  formData,
  onFieldChange,
}: CreateTaskFormProps) {
  return (
    <YStack gap="$3">
      <FormField label="Title">
        <Input
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.title}
          onChangeText={(t) => onFieldChange('title', t)}
          placeholder="Task title"
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
          placeholder="What needs to be done?"
          placeholderTextColor="$color7"
          numberOfLines={4}
          minHeight={100}
        />
      </FormField>

      <FormField label="Deadline">
        <Input
          type="datetime-local"
          size="$4"
          backgroundColor="$color3"
          borderColor="$color5"
          color="$color12"
          value={formData.deadline}
          onChangeText={(t) => onFieldChange('deadline', t)}
          placeholderTextColor="$color7"
        />
      </FormField>
    </YStack>
  );
}
