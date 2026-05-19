import React from 'react';
import { YStack, XStack, ScrollView, Text, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { ExternalPathString } from 'expo-router';
import { useProfile } from '../hooks/useProfile';
import { useUser } from '../context/currentUserContext';
import { pagePath } from '../lib/constants';
import {
  ProfileAvatar,
  DigitalEcosystemCard,
  ActiveSessionBadge,
  LogoutButton,
} from '../components/profile';
import { NavigationRail } from '../components/dashboard';

/**
 * Profile screen — accessible at /profile.
 * Displays user avatar, username, connected accounts, and logout.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useUser();
  const { profile, isLoading, error, bindGoogle, bindMicrosoft } = useProfile();

  /** Handle logout: clear session and navigate to login */
  const handleLogout = async () => {
    await logout();
    router.replace(pagePath.fromRoot.loginScreen as ExternalPathString);
  };

  // Loading state
  if (isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor="$color1"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="large" color="$accent8" />
        <Text marginTop="$3" color="$color8">
          Loading profile...
        </Text>
      </YStack>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <YStack
        flex={1}
        backgroundColor="$color1"
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <Text fontSize="$5" fontWeight="700" color="$color12">
          Profile unavailable
        </Text>
        <Text marginTop="$2" color="$color8" textAlign="center">
          {error ?? 'Could not load your profile.'}
        </Text>
      </YStack>
    );
  }

  return (
    <XStack flex={1} backgroundColor="$color1">
      <NavigationRail />

      <YStack flex={1}>
      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 24,
          maxWidth: 800,
          width: '100%',
          alignSelf: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & username */}
        <YStack alignItems="center" marginTop="$6" marginBottom="$6">
          <ProfileAvatar
            username={profile.username}
            avatarUrl={profile.avatarUrl}
          />
        </YStack>

        {/* Digital ecosystem (Google / Microsoft bindings) */}
        <DigitalEcosystemCard
          googleEmail={profile.google_email}
          microsoftEmail={profile.microsoft_email}
          onBindGoogle={bindGoogle}
          onBindMicrosoft={bindMicrosoft}
        />

        {/* Active session indicator */}
        <YStack marginTop="$4">
          <ActiveSessionBadge email={profile.email} />
        </YStack>

        {/* Logout */}
        <LogoutButton onLogout={handleLogout} />
      </ScrollView>
      </YStack>
    </XStack>
  );
}