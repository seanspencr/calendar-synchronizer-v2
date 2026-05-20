import { Text, View, Input, AlertDialog, Button, useToastController } from "tamagui";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExternalPathString, Link, useRouter } from "expo-router";
import React from "react";
import { useLogin } from "../hooks/useLogin";
import * as AuthSession from "expo-auth-session";
import { useMicrosoftRegister } from "../hooks/useMicrosoftRegister";
import { useGoogleRegister } from "../hooks/useGoogleRegister";
import { useUser } from "../context/currentUserContext";
import { LoginResponseDto } from "../api-client";
import { StorageService } from "../services/storageService";
import { useGetProfile } from "../hooks/useGetProfile";

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
    const response : LoginResponseDto | null= googleRegisterResponse ?? microsoftRegisterResponse ?? loginResponse;
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
      if(!user && !isLoading && token){
        const { profile, setProfile, isLoading, error, fetchProfile } = useGetProfile()
        fetchProfile().then(()=>{

          if(error){
            StorageService.clearAccessToken();
            return
          }

          if(profile){
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

  // Don't render login form while checking stored session
  if (isLoading) return null;

  // Already logged in — redirect effect will fire, render nothing
  if (user) return null;
  return (
      <View>
      <Text>Login</Text>

      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "100%", marginTop: 20 }}>
        <Button onPress={handleLogin} disabled={loginLoading}>
          Login with credentials
        </Button>
        <Button onPress={() => googlePromptAsync()}>
          Register with Google
        </Button>
        <Button onPress={() => microsoftPromptAsync()}>
          Register with Microsoft
        </Button>
        <Button onPress={() => router.push('/registerScreen')}>
          Go to Register Screen
        </Button>
      </View>
    </View>
  );
}