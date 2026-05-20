import { Stack } from "expo-router";
import { TamaguiProvider, ToastProvider } from 'tamagui'
import config from '../tamagui.config'
import React, { useEffect } from 'react';
import { useFonts } from "expo-font";
import { UserProvider } from "./context/currentUserContext";

export default function RootLayout() {

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <ToastProvider>
        <UserProvider>
          <Stack initialRouteName={"(auth)"} screenOptions={{ contentStyle: { backgroundColor: '#001200' } }}>
            <Stack.Screen name={"(auth)"} options={{ headerShown: false }} />
            <Stack.Screen name={"(main)"} options={{ headerShown: false }} />
          </Stack>
        </UserProvider>
      </ToastProvider>
    </TamaguiProvider>
  );
}