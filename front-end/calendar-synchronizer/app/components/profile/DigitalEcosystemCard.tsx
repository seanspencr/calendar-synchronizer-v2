import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { BindAccountButton } from './BindAccountButton';

interface DigitalEcosystemCardProps {
  googleEmail?: string | null;
  microsoftEmail?: string | null;
  onBindGoogle: () => void;
  onBindMicrosoft: () => void;
}

/**
 * Card section showing connected accounts (Google / Microsoft)
 * with bind buttons for accounts not yet linked.
 */
export function DigitalEcosystemCard({
  googleEmail,
  microsoftEmail,
  onBindGoogle,
  onBindMicrosoft,
}: DigitalEcosystemCardProps) {
  return (
    <YStack
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color4"
      padding="$4"
      gap="$4"
    >
      {/* Section header */}
      <XStack alignItems="center" gap="$2">
        <Feather name="link" size={16} color="#8fb87a" />
        <Text
          fontSize={11}
          fontWeight="700"
          color="$color8"
          letterSpacing={1.5}
          textTransform="uppercase"
        >
          Digital Ecosystem
        </Text>
      </XStack>

      {/* Description */}
      <Text fontSize="$3" color="$color9" lineHeight={20}>
        Integrate your professional suites to enable high-performance
        synchronization across all endpoints.
      </Text>

      {/* Account buttons */}
      <XStack gap="$3" flexWrap="wrap">
        <BindAccountButton
          provider="Google"
          boundEmail={googleEmail}
          onBind={onBindGoogle}
          accentColor="#4285F4"
          icon="mail"
        />
        <BindAccountButton
          provider="Microsoft"
          boundEmail={microsoftEmail}
          onBind={onBindMicrosoft}
          accentColor="#00A4EF"
          icon="mail"
        />
      </XStack>
    </YStack>
  );
}
