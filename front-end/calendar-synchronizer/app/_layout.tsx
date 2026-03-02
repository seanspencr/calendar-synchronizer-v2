import { Stack } from "expo-router";
import { pagePath } from "./lib/constants";
import { TamaguiProvider, ToastProvider } from 'tamagui'
import config from '../tamagui.config'
import React from 'react';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <ToastProvider>
        <Stack initialRouteName={pagePath.fromRoot.loginScreen}>
          <Stack.Screen name={pagePath.fromRoot.main} options={{ title: "Home" }} />
          <Stack.Screen name={pagePath.fromRoot.registerScreen} options={{ headerShown: false }} />
          <Stack.Screen name={pagePath.fromRoot.loginScreen}  options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </TamaguiProvider>
  );
}