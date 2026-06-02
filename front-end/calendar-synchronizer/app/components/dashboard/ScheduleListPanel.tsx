import React, { useState, useCallback } from 'react';
import { YStack, XStack, Text, ScrollView, Button } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { ScheduleDto } from '../../api-client';
import { ScheduleProviderButton } from './ScheduleProviderButton';

// ─── Context menu state ───────────────────────────────────────────────────────

interface ContextMenuState {
  event: ScheduleDto;
  x: number;
  y: number;
}

// ─── Context menu popover ─────────────────────────────────────────────────────

function ScheduleContextMenu({
  menu,
  onDelete,
  onClose,
}: {
  menu: ContextMenuState;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const handleDelete = useCallback(() => {
    onDelete(menu.event.id);
    onClose();
  }, [onDelete, menu.event.id, onClose]);

  return (
    <>
      {/* Invisible full-screen backdrop */}
      <YStack
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9998}
        onPress={onClose}
      />

      {/* Floating popover */}
      <YStack
        position="fixed"
        // @ts-ignore – web-only style prop
        style={{ left: menu.x, top: menu.y }}
        zIndex={9999}
        backgroundColor="$color2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color5"
        overflow="hidden"
        minWidth={180}
        // @ts-ignore – web shadow
        boxShadow="0 8px 24px rgba(0,0,0,0.35)"
      >
        {/* Delete */}
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2.5"
          gap="$2.5"
          alignItems="center"
          hoverStyle={{ backgroundColor: '#3f1a1a' }}
          pressStyle={{ opacity: 0.8 }}
          cursor="pointer"
          onPress={handleDelete}
        >
          <Feather name="trash-2" size={15} color="#f87171" />
          <Text fontSize="$3" color="#f87171">
            Delete Schedule
          </Text>
        </XStack>
      </YStack>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ScheduleListPanelProps {
  events: ScheduleDto[];
  onDeleteSchedule?: (id: string) => void;
  onSyncGoogle?: () => void;
  onSyncMicrosoft?: () => void;
}

/** Color mapping based on schedule provider */
function getSourceColor(provider?: object): string {
  const p = String(provider ?? '').toUpperCase();
  switch (p) {
    case 'GOOGLE':
      return '#4285F4';
    case 'MICROSOFT':
      return '#00A4EF';
    default:
      return '#8fb87a';
  }
}

/** Format time range for display */
function formatTimeRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  return `${startDate.toLocaleTimeString([], opts)} - ${endDate.toLocaleTimeString([], opts)}`;
}

/** Format the date for display */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Single event card — navigates to schedule detail on press, right-click opens context menu */
function EventItem({
  event,
  onPress,
  onContextMenu,
}: {
  event: ScheduleDto;
  onPress: () => void;
  onContextMenu: (event: ScheduleDto, x: number, y: number) => void;
}) {
  const accentColor = getSourceColor(event.schedule_provider);
  const providerLabel = String(event.schedule_provider ?? '').toLowerCase();

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(event, e.clientX, e.clientY);
    },
    [event, onContextMenu],
  );

  return (
    <XStack
      gap="$3"
      paddingVertical="$3"
      paddingHorizontal="$3"
      borderBottomWidth={1}
      borderBottomColor="$color3"
      pressStyle={{ opacity: 0.7, backgroundColor: '$color2' }}
      cursor="pointer"
      onPress={onPress}
      // @ts-ignore – web-only event
      onContextMenu={handleContextMenu}
    >
      {/* Left accent bar */}
      <YStack
        width={3}
        backgroundColor={accentColor}
        borderRadius="$1"
        alignSelf="stretch"
      />

      <YStack flex={1} gap="$1">
        <Text fontSize="$3" fontWeight="700" color="$color12">
          {event.event ?? '(No title)'}
        </Text>

        <XStack gap="$2" alignItems="center">
          <Feather name="calendar" size={12} color="#888" />
          <Text fontSize="$1" color="$color8">
            {formatDate(event.event_date)}
          </Text>
        </XStack>

        {event.start_time && event.end_time ? (
          <XStack gap="$2" alignItems="center">
            <Feather name="clock" size={12} color="#888" />
            <Text fontSize="$1" color="$color8">
              {formatTimeRange(event.start_time, event.end_time)}
            </Text>
          </XStack>
        ) : null}

        {providerLabel && providerLabel !== 'local' ? (
          <XStack
            alignSelf="flex-start"
            backgroundColor={accentColor + '20'}
            borderRadius="$2"
            paddingHorizontal="$2"
            paddingVertical={2}
            marginTop="$1"
          >
            <Text fontSize={10} fontWeight="600" color={accentColor} textTransform="capitalize">
              {providerLabel}
            </Text>
          </XStack>
        ) : null}

        {event.description ? (
          <Text fontSize="$1" color="$color7" numberOfLines={2} opacity={0.75}>
            {event.description}
          </Text>
        ) : null}
      </YStack>
    </XStack>
  );
}

/** Scrollable list of upcoming events sorted by start time.
 *  Right-clicking any row opens a context menu with a Delete option. */
export function ScheduleListPanel({ events, onDeleteSchedule, onSyncGoogle, onSyncMicrosoft }: ScheduleListPanelProps) {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const sorted = [...events].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
  );

  const handleContextMenu = useCallback(
    (event: ScheduleDto, x: number, y: number) => {
      setContextMenu({ event, x, y });
    },
    [],
  );

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleDelete = useCallback(
    (id: string) => {
      onDeleteSchedule?.(id);
    },
    [onDeleteSchedule],
  );

  return (
    <YStack flex={1}>
      <YStack gap="$2" paddingHorizontal="$3" marginVertical="$3" flexDirection="column">
        <ScheduleProviderButton provider="GOOGLE" onPress={onSyncGoogle} />
        <ScheduleProviderButton provider="MICROSOFT" onPress={onSyncMicrosoft} />
      </YStack>

      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$3"
        paddingVertical="$3"
      >
        <Text fontSize="$2" fontWeight="700" color="$color10" letterSpacing={1.5}>
          UPCOMING EVENTS
        </Text>
        <XStack
          backgroundColor="$color4"
          borderRadius="$2"
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text fontSize="$2" fontWeight="700" color="$color11">
            {String(events.length).padStart(2, '0')}
          </Text>
        </XStack>
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {sorted.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onPress={() => router.push(`/schedule/${event.id}`)}
            onContextMenu={handleContextMenu}
          />
        ))}
      </ScrollView>

      {/* Right-click context menu */}
      {contextMenu && (
        <ScheduleContextMenu
          menu={contextMenu}
          onDelete={handleDelete}
          onClose={closeContextMenu}
        />
      )}
    </YStack>
  );
}
