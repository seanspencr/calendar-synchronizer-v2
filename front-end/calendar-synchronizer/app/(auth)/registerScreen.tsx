import {View, TextInput} from "react-native";
import { body, textInput } from "../styles/textStyles";
import { useEffect, useState } from "react";
import { Text ,Button, Form, Spinner, AnimatePresence, YStack} from "tamagui";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");



    const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')

    useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

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
                    <Form
            items="center"
            gap="$2"
            onSubmit={() => setStatus('submitting')}
            borderWidth={1}
            rounded="$4"
            bg="$color2"
            borderColor="$borderColor"
            minW={350}
            p="$6"
            >
            <Form.Trigger asChild disabled={status !== 'off'}>
                <YStack gap="$4">
                <Button>Submit</Button>
                <YStack width="100%" height={40} justifyContent="center" alignItems="center">
                    <AnimatePresence>
                    {status === 'submitting' ? (
                        <Spinner
                        transition="medium"
                        enterStyle={{ opacity: 0 }}
                        alignSelf="center"
                        key="spinner"
                        width={8}
                        />
                    ) : null}
                    </AnimatePresence>
                </YStack>
                </YStack>
            </Form.Trigger>
            </Form>
            <Button onPress={() => console.log("Register pressed")}>Register</Button>
        </View>
    )
}