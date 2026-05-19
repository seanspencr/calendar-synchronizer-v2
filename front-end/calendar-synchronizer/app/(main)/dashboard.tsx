import React, { useMemo } from 'react';
import { XStack, YStack, ScrollView } from 'tamagui';
import {
  CalendarGrid,
  DashboardSidebar,
  NavigationRail,
  TaskColumnPanel,
} from '../components/dashboard';
import { useTasks } from '../hooks/useTasks';
import { useSchedules } from '../hooks/useSchedules';
import { useChatbot } from '../hooks/useChatbot';
import { useDailyQuest } from '../hooks/useDailyQuest';
import { useUser } from '../context/currentUserContext';
import type { UserProfile } from '../components/dashboard/types';

export default function DashboardScreen() {
  const { user } = useUser();
  const { tasks, toggleTask } = useTasks();
  const { schedules } = useSchedules();
  const { messages, isTyping, sendMessage } = useChatbot();
  const { dailyQuestIds, commitTask, uncommitTask } = useDailyQuest();

  // Build user profile from context (fallback for dummy display)
  const userProfile: UserProfile = {
    userid: user?.userid ?? 'demo-user',
    username: user?.username ?? 'Strategy Hub',
    email: user?.email ?? 'user@example.com',
  };

  // Split tasks into daily quest vs all (remaining)
  const dailyTasks = useMemo(
    () => tasks.filter((t) => dailyQuestIds.has(t.id)),
    [tasks, dailyQuestIds],
  );
  const remainingTasks = useMemo(
    () => tasks.filter((t) => !dailyQuestIds.has(t.id)),
    [tasks, dailyQuestIds],
  );

  return (
    <XStack flex={1} backgroundColor="$color1">
      {/* Left navigation rail */}
      <NavigationRail />

      {/* Main content area */}
      <YStack flex={1}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* Calendar */}
          <CalendarGrid events={schedules} />

          {/* Daily Quest + All Tasks columns */}
          <XStack gap="$3" padding="$3" minHeight={250}>
            <TaskColumnPanel
              title="Daily Quest"
              icon="zap"
              iconColor="#facc15"
              tasks={dailyTasks}
              onToggle={toggleTask}
              onTransfer={uncommitTask}
              transferDirection="uncommit"
              emptyMessage="Drag tasks here to commit for today"
            />
            <TaskColumnPanel
              title="All Tasks"
              icon="list"
              iconColor="#8fb87a"
              tasks={remainingTasks}
              onToggle={toggleTask}
              onTransfer={commitTask}
              transferDirection="commit"
              emptyMessage="All tasks committed — great work!"
            />
          </XStack>
        </ScrollView>
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