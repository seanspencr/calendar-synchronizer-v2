import React from 'react';
import { XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

interface BindAccountButtonProps {
  /** The provider name displayed on the button */
  provider: 'Google' | 'Microsoft';
  /** If bound, display the linked email. Otherwise show the bind button. */
  boundEmail?: string | null;
  /** Called when the user taps to bind */
  onBind: () => void;
  /** Accent color for the provider */
  accentColor: string;
  /** Icon name from Feather */
  icon: React.ComponentProps<typeof Feather>['name'];
}

/**
 * Shows either a "Bind with {provider}" button or the connected email.
 * Used for Google and Microsoft account integration.
 */
export function BindAccountButton({
  provider,
  boundEmail,
  onBind,
  accentColor,
  icon,
}: BindAccountButtonProps) {
  if (boundEmail) {
    return (
      <XStack
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color4"
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        gap="$3"
        flex={1}
        minWidth={200}
      >
        <Feather name={icon} size={18} color={accentColor} />
        <XStack flex={1} gap="$1" flexDirection="column">
          <Text
            fontSize={10}
            fontWeight="700"
            color="$color7"
            letterSpacing={1}
            textTransform="uppercase"
          >
            {provider} Account
          </Text>
          <Text fontSize="$2" fontWeight="600" color="$color11">
            {boundEmail}
          </Text>
        </XStack>
        <Feather name="check-circle" size={16} color="#4ade80" />
      </XStack>
    );
  }

  return (
    <Button
      size="$4"
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color4"
      pressStyle={{ opacity: 0.8, backgroundColor: '$color3' }}
      onPress={onBind}
      flex={1}
      minWidth={200}
      icon={<Feather name={icon} size={18} color={accentColor} />}
    >
      <Text fontSize="$3" fontWeight="600" color="$color11">
        Bind with {provider}
      </Text>
    </Button>
  );
}
