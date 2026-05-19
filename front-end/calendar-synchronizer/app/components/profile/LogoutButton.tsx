import React from 'react';
import { Button, Text } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface LogoutButtonProps {
  onLogout: () => void;
}

/**
 * Prominent logout button with a red accent.
 */
export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button
      size="$4"
      backgroundColor="$color3"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color5"
      pressStyle={{ opacity: 0.8, backgroundColor: '#3a1515' }}
      onPress={onLogout}
      icon={<Feather name="log-out" size={16} color="#f87171" />}
      marginTop="$3"
    >
      <Text fontSize="$3" fontWeight="700" color="#f87171">
        Sign Out
      </Text>
    </Button>
  );
}
