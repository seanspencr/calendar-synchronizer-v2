import { Stack } from "expo-router";
import { pagePath } from "./lib/constants";

export default function RootLayout() {
  return (
    <Stack initialRouteName={pagePath.fromRoot.loginScreen}>
      <Stack.Screen name={pagePath.fromRoot.main} options={{ title: "Home" }} />
      <Stack.Screen name={pagePath.fromRoot.registerScreen} options={{ headerShown: false }} />
      <Stack.Screen name={pagePath.fromRoot.loginScreen}  options={{ headerShown: false }} />
    </Stack>
  );
}