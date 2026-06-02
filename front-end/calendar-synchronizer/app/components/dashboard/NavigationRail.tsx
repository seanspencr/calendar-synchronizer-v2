import React from 'react';
import { YStack } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter, usePathname } from 'expo-router';

interface NavItem {
  icon: React.ComponentProps<typeof Feather>['name'];
  route: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', route: '/dashboard', label: 'Dashboard' },
  { icon: 'user', route: '/profile', label: 'Profile' },
];

/**
 * Narrow left navigation rail with icon buttons.
 * Highlights the active route and navigates on press.
 */
export function NavigationRail() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <YStack
      width={56}
      backgroundColor="$color2"
      borderRightWidth={1}
      borderRightColor="$color4"
      alignItems="center"
      paddingVertical="$4"
      gap="$3"
      height="100%"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.route ||
          pathname.startsWith(item.route + '/');

        return (
          <YStack
            key={item.route}
            width={40}
            height={40}
            borderRadius="$3"
            alignItems="center"
            justifyContent="center"
            backgroundColor={isActive ? '$accent8' : 'transparent'}
            pressStyle={{ opacity: 0.7, backgroundColor: '$color3' }}
            cursor="pointer"
            onPress={() => router.push(item.route as any)}
          >
            <Feather
              name={item.icon}
              size={20}
              color={isActive ? '#fff' : '#888'}
            />
          </YStack>
        );
      })}
    </YStack>
  );
}
