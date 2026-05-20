import { Tabs } from "expo-router";
import { YStack, XStack, Text } from "tamagui";
import Feather from "@expo/vector-icons/Feather";

/** Global top bar displaying the app name */
function AppTopBar() {
  return (
    <XStack
      height={48}
      backgroundColor="$color2"
      borderBottomWidth={1}
      borderBottomColor="$color4"
      alignItems="center"
      paddingHorizontal="$4"
      gap="$2"
    >
      <Feather name="refresh-cw" size={16} color="#8fb87a" />
      <Text fontSize="$4" fontWeight="800" color="$color12" letterSpacing={1}>
        SyncIt
      </Text>
    </XStack>
  );
}

export default function TabLayout() {
  return (
    <YStack flex={1}>
      <AppTopBar />
      <Tabs
        initialRouteName={"dashboard"}
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      >
        <Tabs.Screen name={'dashboard'} options={{ title: "Dashboard" }} />
        <Tabs.Screen name={'profile'} options={{ title: "Profile" }} />
        <Tabs.Screen name="schedule/[id]" options={{ title: "Schedule Detail", href: null }} />
        <Tabs.Screen name="task/[id]" options={{ title: "Task Detail", href: null }} />
      </Tabs>
    </YStack>
  );
}
