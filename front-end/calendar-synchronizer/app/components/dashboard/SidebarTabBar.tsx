import React from 'react';
import { XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';

export type SidebarTab = 'chatbot' | 'tasks' | 'events';

interface SidebarTabBarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const TABS: { key: SidebarTab; label: string; icon: string }[] = [
  { key: 'chatbot', label: 'CHATBOT', icon: 'message-circle' },
  { key: 'tasks', label: 'TASKS', icon: 'check-square' },
  { key: 'events', label: 'EVENTS', icon: 'calendar' },
];

/** Tab bar for switching between Chatbot, Tasks, and Events panels */
export function SidebarTabBar({ activeTab, onTabChange }: SidebarTabBarProps) {
  return (
    <XStack
      justifyContent="space-around"
      borderBottomWidth={1}
      borderBottomColor="$color4"
      paddingBottom="$2"
    >
      {TABS.map(({ key, label, icon }) => {
        const isActive = activeTab === key;
        return (
          <Button
            key={key}
            unstyled
            onPress={() => onTabChange(key)}
            paddingVertical="$2"
            paddingHorizontal="$3"
            opacity={isActive ? 1 : 0.5}
            borderBottomWidth={isActive ? 2 : 0}
            borderBottomColor={isActive ? '$accent9' : 'transparent'}
            alignItems="center"
            gap="$1"
          >
            <Feather
              name={icon}
              size={18}
              color={isActive ? '#8fb87a' : '#888'}
            />
            <Text
              fontSize="$1"
              fontWeight="600"
              letterSpacing={1}
              color={isActive ? '$color12' : '$color8'}
            >
              {label}
            </Text>
          </Button>
        );
      })}
    </XStack>
  );
}
