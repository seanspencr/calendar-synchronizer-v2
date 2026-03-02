import { Tabs } from "expo-router";
import { pagePath } from "../lib/constants";

export default function TabLayout() {
    return(
        <Tabs initialRouteName={pagePath.fromMain.dashboard}>
            <Tabs.Screen name={pagePath.fromMain.dashboard} options={{ title: "Dashboard" }} />
            <Tabs.Screen name={pagePath.fromMain.profile} options={{ title: "Profile" }} />
        </Tabs>
    )
}