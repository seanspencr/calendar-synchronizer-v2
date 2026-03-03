import { Stack } from "expo-router";
import { pagePath } from "./lib/constants";
import { TamaguiProvider, ToastProvider } from 'tamagui'
import config from '../tamagui.config'
import React, { useEffect } from 'react';
import { useFonts } from "expo-font";

export default function RootLayout() {

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <ToastProvider>
        <Stack initialRouteName={pagePath.fromRoot.loginScreen} screenOptions={{contentStyle : { backgroundColor: '#001200' }}}>
          <Stack.Screen name={pagePath.fromRoot.main} options={{ title: "Home" }} />
          <Stack.Screen name={pagePath.fromRoot.registerScreen} options={{ headerShown: false }} />
          <Stack.Screen name={pagePath.fromRoot.loginScreen}  options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </TamaguiProvider>
  );
}