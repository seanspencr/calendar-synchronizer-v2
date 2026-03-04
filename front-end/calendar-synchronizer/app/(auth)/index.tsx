import { Text, View, Input, AlertDialog, Button, useToastController } from "tamagui";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React from "react";
import { useGoogleAuthCode } from "../hooks/useGoogleAuthCode";
import { useMicrosoftLogin } from "../hooks/useMicrosoftLogin";
import { useGoogleCodeLogin } from "../hooks/useGoogleCodeLogin";
import { useLogin } from "../hooks/useLogin";
import { pagePath } from "../lib/constants";
import * as AuthSession from "expo-auth-session";
import { useMicrosoftRegister } from "../hooks/useMicrosoftRegister";

export default function Index() {
  WebBrowser.maybeCompleteAuthSession();

  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  // const [calendarEvents, setCalendarEvents] = useState([]);


  const [gooogleRequest, googleResponse, googlePromptAsync] = useGoogleAuthCode();
  // const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = useMicrosoftLogin()
  
  const {isLoadingMicrosoft, microsoftPromptAsync, registerResponse} = useMicrosoftRegister()
  const getUserInfoWithGoogle = async (token : any) => {
    //absent token
    if (!token) return;
    //present token
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      //store user information  in Asyncstorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(
        "Failed to fetch user data:",
        googleResponse!.status,
        googleResponse!.statusText
      );
    }
  };

  const getCalendarEvents = async (token : any) => {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    console.log("Events:", data.items);
    setCalendarEvents(data.items);

        // {
    //   "kind":"calendar#event",
    //   "etag":"\"3465343751906000\"",
    //   "id":"32lj6e69abdf5q9gaut4u3e2hh",
    //   "status":"confirmed",
    //   "htmlLink":"https://www.google.com/calendar/event?eid=MzJsajZlNjlhYmRmNXE5Z2F1dDR1M2UyaGggc2VhbnNwZW5jZXIyODA4MDZAbQ",
    //   "created":"2024-11-27T01:44:35.000Z",
    //   "updated":"2024-11-27T01:44:35.953Z",
    //   "summary":"Kelas",
    //   "colorId":"6",
    //   "creator":{
    //     "email":"seanspencer280806@gmail.com",
    //     "self":true
    //   },
    //   "organizer":{
    //     "email":"seanspencer280806@gmail.com",
    //     "self":true
    //   },
    //   "start":{
    //     "dateTime":"2024-12-17T07:00:00+07:00",
    //     "timeZone":"Asia/Jakarta"
    //   },
    //   "end":{
    //     "dateTime":"2024-12-17T13:00:00+07:00",
    //     "timeZone":"Asia/Jakarta"
    //   },
    //   "iCalUID":"32lj6e69abdf5q9gaut4u3e2hh@google.com",
    //   "sequence":0,
    //   "reminders":{
    //     "useDefault":true
    //   },
    //   "eventType":"default"
    // }
  };

  const signInWithGoogle = async () => {
  try {
    // Attempt to retrieve user information from AsyncStorage
    const userJSON = await AsyncStorage.getItem("user");

    if (userJSON) {
      // If user information is found in AsyncStorage, parse it and set it in the state
      setUserInfo(JSON.parse(userJSON));
    } else if (googleResponse?.type === "success") {
      // If no user information is found and the response type is "success" (assuming response is defined),
      // call getUserInfo with the access token from the response
      getUserInfoWithGoogle(googleResponse!.authentication.accessToken);
    }

    getCalendarEvents(googleResponse!.authentication.accessToken);
  } catch (error) {
    // Handle any errors that occur during AsyncStorage retrieval or other operations
    console.error("Error retrieving user data from AsyncStorage:", error);
  }
};


async function fetchCalendarMicrosoft(token : string){
      let res = await fetch("https://graph.microsoft.com/v1.0/me/calendar/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await res.json();
      console.log("Microsoft calendar events:", data);
}
useEffect(() => {
  if(googleResponse == null || googleResponse == undefined) return;
  if(gooogleRequest == null || gooogleRequest == undefined) return;
  // signInWithGoogle();
  console.log(googleResponse)
  const code = googleResponse?.params?.code;
  const codeVerifier = gooogleRequest.codeVerifier;
  const redirectUri = gooogleRequest.redirectUri;
  useGoogleCodeLogin(code, codeVerifier, redirectUri);
}, [gooogleRequest, googleResponse]);

//log the userInfo to see user details
console.log("userInfo:", JSON.stringify(userInfo))


  const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`;   
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {login, isLoading, response} = useLogin()

  const toast = useToastController()

  function handleLogin(){
    try{
      login({username : username, password : password});
      toast.show("Login successful", { message: "You have been logged in successfully." });
    }catch(error){
      toast.show("Login Failed", { message: JSON.stringify(error) });
    }
  }

  useEffect(() => {
  if (response) {
    toast.show("Login successful", { message: JSON.stringify(response) });
    window.alert("Login successful: " + JSON.stringify(response));
    console.log("Login response:", response);
  }
}, [response]);
  
  return (
    <View>
      <Text>
        Login
      </Text>

      {
        userInfo && (
          <Text>
            userInfo: {JSON.stringify(userInfo)}
          </Text>
        )
      }

      {/* {
        calendarEvents.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Calendar Events:
            </Text>
          </View>
            // {calendarEvents.map((event) => (
              // <View key={event.id} style={{ marginBottom: 10 }}>
              //   <Text>{JSON.stringify(event)}</Text>
              //   <Text style={{ fontSize: 16 }}>{event.summary}</Text>
              //   <Text style={{ color: "#666" }}>
              //     {new Date(event.start.dateTime).toLocaleString()} -{" "}
              //     {new Date(event.end.dateTime).toLocaleString()}
              //   </Text>
              // </View>
            // ))}
        )
      } */}

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

      <Button
        onPress={handleLogin}
      >
        <Text>
          Login
        </Text>
      </Button>

      <View
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          width: "100%",
          marginTop: 20,
        }}
      >
        <Button onPress={()=>{handleLogin()}}>Login with credential</Button>
        <Button onPress={()=>{googlePromptAsync()}}>register with google (rial)</Button>
        <Button onPress={() => router.push(pagePath.fromRoot.registerScreen)}>Go to Register Screen</Button>
        <Button onPress={() => router.push(pagePath.fromRoot.dashboard)}>Navigate to main screen</Button>
        {/* <Button onPress={()=>{microsoftPromptAsync()}}>sign in with microsoft</Button> */}
        <Button onPress={()=>{microsoftPromptAsync()}}>Register with microsoft</Button>

      </View>
      <Link href={pagePath.fromRoot.registerScreen}>Go to Register Screen</Link>
    </View>
  );
}