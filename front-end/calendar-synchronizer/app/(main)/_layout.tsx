import { Tabs } from "expo-router";
import { pagePath } from "../lib/constants";

export default function TabLayout() {
    return(
        <Tabs initialRouteName={pagePath.fromMain.dashboard} screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
            <Tabs.Screen name={pagePath.fromMain.dashboard} options={{ title: "Dashboard" }} />
            <Tabs.Screen name={pagePath.fromMain.profile} options={{ title: "Profile" }} />
            <Tabs.Screen name="schedule/[id]" options={{ title: "Schedule Detail", href: null }} />
            <Tabs.Screen name="task/[id]" options={{ title: "Task Detail", href: null }} />
        </Tabs>
    )
}