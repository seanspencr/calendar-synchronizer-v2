import React from 'react';
import { YStack, XStack, Text, ScrollView } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { ScheduleDto } from '../../api-client';

interface EventListPanelProps {
  events: ScheduleDto[];
}

/** Color mapping based on event source */
function getSourceColor(source?: string): string {
  switch (source) {
    case 'google':
      return '#4285F4';
    case 'microsoft':
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

/** Single event card — navigates to schedule detail on press */
function EventItem({ event, onPress }: { event: ScheduleDto; onPress: () => void }) {
  const accentColor = getSourceColor(event.source);

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
          {event.title}
        </Text>

        <XStack gap="$2" alignItems="center">
          <Feather name="clock" size={12} color="#888" />
          <Text fontSize="$1" color="$color8">
            {formatDate(event.startTime)} · {formatTimeRange(event.startTime, event.endTime)}
          </Text>
        </XStack>

        {event.location ? (
          <XStack gap="$2" alignItems="center">
            <Feather name="map-pin" size={12} color="#888" />
            <Text fontSize="$1" color="$color8">
              {event.location}
            </Text>
          </XStack>
        ) : null}

        {event.source ? (
          <XStack
            alignSelf="flex-start"
            backgroundColor={accentColor + '20'}
            borderRadius="$2"
            paddingHorizontal="$2"
            paddingVertical={2}
            marginTop="$1"
          >
            <Text fontSize={10} fontWeight="600" color={accentColor} textTransform="capitalize">
              {event.source}
            </Text>
          </XStack>
        ) : null}
      </YStack>
    </XStack>
  );
}

/** Scrollable list of upcoming events sorted by start time */
export function EventListPanel({ events }: EventListPanelProps) {
  const router = useRouter();
  const sorted = [...events].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
  );

  return (
    <YStack flex={1}>
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
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
