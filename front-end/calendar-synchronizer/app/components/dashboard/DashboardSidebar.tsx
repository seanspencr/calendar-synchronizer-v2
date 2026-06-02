import React, { useState, useCallback } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { SidebarHeader } from './SidebarHeader';
import { SidebarTabBar, type SidebarTab } from './SidebarTabBar';
import { TaskListPanel } from './TaskListPanel';
import { ScheduleListPanel } from './ScheduleListPanel';
import { ChatbotPanel } from './ChatbotPanel';
import { CreateDialog } from '../create-dialog';
import { ScheduleDto, TaskDto, MessageDto, LoginResponseDto } from '../../api-client';
import { useDeleteTask } from '../../hooks/task/useDeleteTask';
import { useDeleteSchedule } from '../../hooks/schedule/useDeleteSchedule';
import { NLP_MODELS } from '@/app/lib/nlp_models';


// TODO : hapus userprofile disini
interface DashboardSidebarProps {
  user: LoginResponseDto;
  tasks: TaskDto[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleDto[]>>;
  events: ScheduleDto[];
  chatMessages: MessageDto[];
  isChatTyping: boolean;
  onToggleTask: (id: string) => void;
  onSendChat: (content: string, model : NLP_MODELS) => void;
  onSyncGoogle: () => void;
  onSyncMicrosoft: () => void;
}

/** Composite sidebar combining header, tabs, and content panels */
export function DashboardSidebar({
  user,
  tasks,
  events,
  chatMessages,
  isChatTyping,
  setTasks,
  setSchedules,
  onToggleTask,
  onSendChat,
  onSyncGoogle,
  onSyncMicrosoft
}: DashboardSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('tasks');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  /** Task selected via context menu "Add Subtask" — null means generic create */
  const [parentTask, setParentTask] = useState<TaskDto | null>(null);

  /** Open the create dialog in subtask mode for the given task */
  const handleAddSubtask = useCallback((task: TaskDto) => {
    setParentTask(task);
    setIsCreateOpen(true);
  }, []);

  /** Open the dialog in normal (generic) create mode */
  const handleCreateNew = useCallback(() => {
    setParentTask(null);
    setIsCreateOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsCreateOpen(false);
    setParentTask(null);
  }, []);

  const { deleteTask } = useDeleteTask(setTasks);
  const { deleteSchedule } = useDeleteSchedule(setSchedules);

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
          <TaskListPanel
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddSubtask={handleAddSubtask}
            onDeleteTask={deleteTask}
          />
        )}
        {activeTab === 'events' && (
          <ScheduleListPanel events={events} onDeleteSchedule={deleteSchedule} onSyncGoogle={onSyncGoogle} onSyncMicrosoft={onSyncMicrosoft} />
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
          onPress={handleCreateNew}
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

      {/* Create / Add-Subtask dialog overlay */}
      <CreateDialog
        open={isCreateOpen}
        onClose={handleDialogClose}
        setTasks={setTasks}
        setSchedules={setSchedules}
        initialParentTaskId={parentTask?.id}
        initialParentTaskTitle={parentTask?.title}
      />
    </YStack>
  );
}
