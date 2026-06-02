import { Text, View, Input, Button, useToastController, YStack, XStack, Spinner } from "tamagui";
import { useState, useEffect } from "react";
import Feather from '@expo/vector-icons/Feather';
import * as WebBrowser from "expo-web-browser";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExternalPathString, Link, useRouter } from "expo-router";
import React from "react";
import { useLogin } from "../hooks/auth/useLogin";
import * as AuthSession from "expo-auth-session";
import { useMicrosoftRegister } from "../hooks/auth/useMicrosoftRegister";
import { useGoogleRegister } from "../hooks/auth/useGoogleRegister";
import { useUser } from "../context/currentUserContext";
import { LoginResponseDto } from "../api-client";
import { StorageService } from "../services/storageService";
import { useGetProfile } from "../hooks/auth/useGetProfile";

export default function Index() {
  WebBrowser.maybeCompleteAuthSession();

  const router = useRouter();
  const { user, isLoading, login, setUser } = useUser();
  const { promptAsync: microsoftPromptAsync, registerResponse: microsoftRegisterResponse } = useMicrosoftRegister();
  const { isError, registerResponse: googleRegisterResponse, promptAsync: googlePromptAsync } = useGoogleRegister();
  const { login: loginWithCredentials, isLoading: loginLoading, response: loginResponse, error: loginError } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToastController();

  // ✅ Single effect: save to context+storage whenever ANY auth flow succeeds
  useEffect(() => {
    const response: LoginResponseDto | null = googleRegisterResponse ?? microsoftRegisterResponse ?? loginResponse;
    if (!response) return;

    login({
      google_email: response.google_email,
      microsoft_email: response.microsoft_email,
      username: response.username,
      userid: response.userid,
      accessToken: response.accessToken,
    });
  }, [googleRegisterResponse, microsoftRegisterResponse, loginResponse]);

  // ✅ Single redirect: fires whenever user becomes non-null
  useEffect(() => {
    const checkAuth = async () => {
      const token = await StorageService.getAccessToken();

      if (!isLoading && user && token) {
        router.replace('/dashboard');
      }

      // klo gaada user di context, coba fetch dlu
      if (!user && !isLoading && token) {
        const { profile, setProfile, isLoading, error, fetchProfile } = useGetProfile()
        fetchProfile().then(() => {

          if (error) {
            StorageService.clearAccessToken();
            return
          }

          if (profile) {
            setUser({
              google_email: profile.google_email!!,
              microsoft_email: profile.microsoft_email!!,
              username: profile.username,
              userid: profile.userId,
              accessToken: "null", //maaf  spaghetti, disini karena dia usercontext, jadi gaperlu simpen acc token
            });
            setProfile(profile);
            router.replace('/dashboard');
          }
        })
      }

    };

    checkAuth();
  }, [user, isLoading]);

  function handleLogin() {
    if (!username || !password) {
      toast.show("Missing fields", { message: "Please enter username and password." });
      return;
    }
    loginWithCredentials({ username, password });
  }

  // Show error toasts
  useEffect(() => {
    if (loginError) {
      toast.show("Login Failed", { message: loginError, duration: 3000 });
    }
  }, [loginError, toast]);

  // Don't render login form while checking stored session
  if (isLoading) return null;

  // Already logged in — redirect effect will fire, render nothing
  if (user) return null;
  return (
    <YStack
      flex={1}
      backgroundColor="$color2"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <YStack
        width="100%"
        maxWidth={400}
        backgroundColor="$color1"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color4"
        padding="$6"
        gap="$5"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.1}
        shadowRadius={10}
        elevation={5}
      >
        <YStack alignItems="center" gap="$2" marginBottom="$2">
          <YStack 
            width={60} 
            height={60} 
            borderRadius={30} 
            backgroundColor="$accent8" 
            justifyContent="center" 
            alignItems="center"
            marginBottom="$2"
          >
            <Feather name="log-in" size={28} color="#fff" />
          </YStack>
          <Text fontSize="$7" fontWeight="800" color="$color12">
            Welcome Back
          </Text>
          <Text fontSize="$3" color="$color8" textAlign="center">
            Log in to continue managing your calendar schedules.
          </Text>
        </YStack>

        <YStack gap="$3">
          <YStack gap="$1.5">
            <Text fontSize="$2" fontWeight="600" color="$color11" marginLeft="$1">
              Username
            </Text>
            <Input
              size="$4"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              backgroundColor="$color2"
              borderColor="$color5"
              autoCapitalize="none"
              focusStyle={{ borderColor: '$accent8' }}
            />
          </YStack>

          <YStack gap="$1.5">
            <Text fontSize="$2" fontWeight="600" color="$color11" marginLeft="$1">
              Password
            </Text>
            <Input
              size="$4"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              backgroundColor="$color2"
              borderColor="$color5"
              focusStyle={{ borderColor: '$accent8' }}
            />
          </YStack>
        </YStack>

        <YStack gap="$3" marginTop="$2">
          <Button
            size="$4"
            backgroundColor="$accent8"
            borderRadius="$3"
            pressStyle={{ opacity: 0.85, backgroundColor: '$accent9' }}
            onPress={handleLogin}
            disabled={loginLoading}
            opacity={loginLoading ? 0.7 : 1}
          >
            {loginLoading ? (
              <Spinner color="#fff" />
            ) : (
              <Text fontSize="$3" fontWeight="700" color="#fff">
                Login
              </Text>
            )}
          </Button>

          <XStack alignItems="center" marginVertical="$2">
            <View flex={1} height={1} backgroundColor="$color5" />
            <Text marginHorizontal="$3" color="$color8" fontSize="$2" fontWeight="600">
              OR
            </Text>
            <View flex={1} height={1} backgroundColor="$color5" />
          </XStack>

          <Button
            size="$4"
            backgroundColor="$color3"
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$3"
            pressStyle={{ opacity: 0.7 }}
            onPress={() => googlePromptAsync()}
            icon={<Feather name="globe" size={18} color="$color11" />}
          >
            <Text fontSize="$3" fontWeight="600" color="$color12">
              Continue with Google
            </Text>
          </Button>

          <Button
            size="$4"
            backgroundColor="$color3"
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$3"
            pressStyle={{ opacity: 0.7 }}
            onPress={() => microsoftPromptAsync()}
            icon={<Feather name="mail" size={18} color="$color11" />}
          >
            <Text fontSize="$3" fontWeight="600" color="$color12">
              Continue with Microsoft
            </Text>
          </Button>

          <XStack justifyContent="center" alignItems="center" gap="$2" marginTop="$2">
            <Text color="$color8" fontSize="$3">
              Don't have an account?
            </Text>
            <Button
              unstyled
              pressStyle={{ opacity: 0.6 }}
              onPress={() => router.push('/registerScreen')}
            >
              <Text color="$accent9" fontSize="$3" fontWeight="bold">
                Register
              </Text>
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}