import {View, Text, TextInput} from "react-native";
import { body, textInput } from "../styles/textStyles";
import { useState } from "react";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    return (
        <View>
            <Text>Register Screen</Text>
            <TextInput 
                style={textInput}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                >
            </TextInput>
            <TextInput 
                style={textInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                >
            </TextInput>
        </View>
    )
}