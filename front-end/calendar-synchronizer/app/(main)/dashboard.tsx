import React, { useState } from 'react';
import { XStack, YStack } from 'tamagui';
import { CalendarGrid, DashboardSidebar, NavigationRail } from '../components/dashboard';
import { useTasks } from '../hooks/useTasks';
import { useSchedules } from '../hooks/useSchedules';
import { useChatbot } from '../hooks/useChatbot';
import { useUser } from '../context/currentUserContext';
import type { UserProfile } from '../components/dashboard/types';

export default function DashboardScreen() {
  const { user } = useUser();
  const { tasks, toggleTask } = useTasks();
  const { schedules } = useSchedules();
  const { messages, isTyping, sendMessage } = useChatbot();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Build user profile from context (fallback for dummy display)
  const userProfile: UserProfile = {
    userid: user?.userid ?? 'demo-user',
    username: user?.username ?? 'Strategy Hub',
    email: user?.email ?? 'user@example.com',
  };

  return (
    <XStack flex={1} backgroundColor="$color1">
      {/* Left navigation rail */}
      <NavigationRail />

      {/* Main calendar area */}
      <YStack flex={1}>
        <CalendarGrid
          events={schedules}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </YStack>

      {/* Right sidebar */}
      <DashboardSidebar
        user={userProfile}
        tasks={tasks}
        events={schedules}
        chatMessages={messages}
        isChatTyping={isTyping}
        onToggleTask={toggleTask}
        onSendChat={sendMessage}
      />
    </XStack>
  );
}