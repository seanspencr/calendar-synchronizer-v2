import React, { useState } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { SidebarHeader } from './SidebarHeader';
import { SidebarTabBar, type SidebarTab } from './SidebarTabBar';
import { TaskListPanel } from './TaskListPanel';
import { EventListPanel } from './EventListPanel';
import { ChatbotPanel } from './ChatbotPanel';
import { CreateDialog } from '../create-dialog';
import type { TaskDto, ScheduleDto, ChatMessage, UserProfile } from './types';

interface DashboardSidebarProps {
  user: UserProfile;
  tasks: TaskDto[];
  events: ScheduleDto[];
  chatMessages: ChatMessage[];
  isChatTyping: boolean;
  onToggleTask: (id: string) => void;
  onSendChat: (content: string) => void;
}

/** Composite sidebar combining header, tabs, and content panels */
export function DashboardSidebar({
  user,
  tasks,
  events,
  chatMessages,
  isChatTyping,
  onToggleTask,
  onSendChat,
}: DashboardSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('tasks');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <YStack
      width={280}
      backgroundColor="$color2"
      borderLeftWidth={1}
      borderLeftColor="$color4"
      height="100%"
    >
      {/* Profile header */}
      <SidebarHeader user={user} />

      {/* Tab bar */}
      <SidebarTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <YStack flex={1}>
        {activeTab === 'tasks' && (
          <TaskListPanel tasks={tasks} onToggleTask={onToggleTask} />
        )}
        {activeTab === 'events' && (
          <EventListPanel events={events} />
        )}
        {activeTab === 'chatbot' && (
          <ChatbotPanel
            messages={chatMessages}
            isTyping={isChatTyping}
            onSend={onSendChat}
          />
        )}
      </YStack>

      {/* Create new button */}
      <YStack paddingHorizontal="$3" paddingVertical="$2">
        <Button
          backgroundColor="$accent7"
          borderRadius="$3"
          height={44}
          icon={<Feather name="plus-circle" size={18} color="#fff" />}
          pressStyle={{ opacity: 0.85 }}
          onPress={() => setIsCreateOpen(true)}
        >
          <Text color="#fff" fontWeight="600" fontSize="$3">
            Create New
          </Text>
        </Button>
      </YStack>

      {/* System status footer */}
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderTopWidth={1}
        borderTopColor="$color3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={10} fontWeight="600" color="$color7" letterSpacing={1}>
            SYSTEM STATUS: OPTIMAL
          </Text>
          <YStack width={6} height={6} borderRadius={3} backgroundColor="#4ade80" />
        </XStack>
        <Text fontSize={9} color="$color6" marginTop="$1">
          LAST SYNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
        </Text>
      </YStack>

      {/* Create dialog overlay */}
      <CreateDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </YStack>
  );
}

