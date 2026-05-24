import React, { useEffect, useMemo } from 'react';
import { XStack, YStack, ScrollView } from 'tamagui';
import {
  CalendarGrid,
  DashboardSidebar,
  NavigationRail,
  TaskColumnPanel,
} from '../components/dashboard';
import { useGetTasks } from '../hooks/task/useGetTasks';
import { useToggleTask } from '../hooks/task/useToggleTask';
import { useGetSchedules } from '../hooks/schedule/useGetSchedules';
import { useGetChatMessages } from '../hooks/useGetChatMessages';
import { useSendChatMessage } from '../hooks/useSendChatMessage';
import { useUser } from '../context/currentUserContext';
import { useUpdateTask } from '../hooks/task/useUpdateTask';
import { LoginResponseDto, TaskDto } from '../api-client';
import { useAddTodolist } from '../hooks/task/useAddTodolist';
import { useSyncGoogleSchedules } from '../hooks/schedule/useSyncGoogleSchedules';
import { useSyncMicrosoftSchedules } from '../hooks/schedule/useSyncMicrosoftSchedules';

export default function DashboardScreen() {
  const { user } = useUser();

  // Query hooks
  const { tasks, setTasks, error: tasksError, isLoading: tasksLoading, fetchTasks } = useGetTasks();
  const { schedules, setSchedules, isLoading: schedulesLoading, error: schedulesError, fetchSchedules } = useGetSchedules();
  const { messages, setMessages, isError: chatIsError, isLoading: chatIsLoading } = useGetChatMessages();


  // Mutation hooks
  const { toggleTask } = useToggleTask(setTasks);
  const { sendMessage, isTyping, error: isSendMessageError, isLoading: isSendChatLoading } = useSendChatMessage(setMessages, fetchTasks, fetchSchedules);
  const { update: updateTodolist, isError: updateTodolistError, isLoading: updateTodolistLoading } = useAddTodolist(setTasks)
  const {sync : syncGoogle, isError : isSyncGoogleError, isLoading : isSyncGoogleLoading} = useSyncGoogleSchedules(fetchSchedules)
  const {sync : syncMicrosoft, isError : isSyncMicrosoftError, isLoading : isSyncMicrosoftLoading} = useSyncMicrosoftSchedules(fetchSchedules)


  const userProfile: LoginResponseDto = {
    userid: user?.userid ?? 'demo-user',
    username: user?.username ?? 'User Not Defined',
    google_email: user?.google_email ?? 'user@gmail.com',
    microsoft_email: user?.microsoft_email ?? 'user@microsoft.com',
    accessToken: user?.accessToken ?? '',
  };

  const dailyTasks = useMemo(
    () => tasks.filter((t) => t.is_todo == true),
    [tasks],
  );
  const remainingTasks = useMemo(
    () => tasks.filter((t) => t.is_todo == false),
    [tasks],
  );

  return (
    <XStack flex={1} backgroundColor="$color1">
      <NavigationRail />

      <YStack flex={1}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <CalendarGrid events={schedules} />

          <XStack gap="$3" padding="$3" minHeight={250}>
            <TaskColumnPanel
              title="Today's to do list"
              icon="zap"
              iconColor="#facc15"
              tasks={dailyTasks}
              onToggle={toggleTask}
              onTransfer={updateTodolist}
              transferDirection="uncommit"
              emptyMessage="Drag tasks here to commit for today"
            />
            <TaskColumnPanel
              title="All Tasks"
              icon="list"
              iconColor="#8fb87a"
              tasks={remainingTasks}
              onToggle={toggleTask}
              onTransfer={updateTodolist}
              transferDirection="commit"
              emptyMessage="All tasks committed — great work!"
            />
          </XStack>
        </ScrollView>
      </YStack>

      <DashboardSidebar
        user={userProfile}
        tasks={tasks}
        setTasks={setTasks}
        setSchedules={setSchedules}
        events={schedules}
        chatMessages={messages}
        isChatTyping={isTyping}
        onToggleTask={toggleTask}
        onSendChat={sendMessage}
        onSyncGoogle={syncGoogle}
        onSyncMicrosoft={syncMicrosoft}
      />
    </XStack>
  );
}