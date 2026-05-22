import React, { useState, useEffect } from "react";
import {
    Text,
    Button,
    Spinner,
    YStack,
    XStack,
    View,
    Input,
    useToastController
} from "tamagui";
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { useRegister } from "../hooks/auth/useRegister";

export default function RegisterScreen() {
    const router = useRouter();
    const toast = useToastController();
    const { register, isLoading, response, error } = useRegister();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Handle successful registration
    useEffect(() => {
        if (response) {
            toast.show("Registration Successful", {
                message: "Your account has been created. Please log in.",
                duration: 3000,
            });
            // Redirect back to login
            router.replace('/');
        }
    }, [response, router, toast]);

    // Handle registration error
    useEffect(() => {
        if (error) {
            toast.show("Registration Failed", {
                message: error,
                duration: 3000,
            });
        }
    }, [error, toast]);

    const handleRegister = () => {
        if (!username || !password || !confirmPassword) {
            toast.show("Missing Fields", {
                message: "Please fill in all fields.",
                duration: 3000,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.show("Passwords don't match", {
                message: "Please ensure both passwords are the same.",
                duration: 3000,
            });
            return;
        }

        register({ username, password });
    };

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
                <YStack alignItems="center" gap="$2" marginBottom="$4">
                    <YStack
                        width={60}
                        height={60}
                        borderRadius={30}
                        backgroundColor="$accent8"
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$2"
                    >
                        <Feather name="user-plus" size={28} color="#fff" />
                    </YStack>
                    <Text fontSize="$7" fontWeight="800" color="$color12">
                        Create an Account
                    </Text>
                    <Text fontSize="$3" color="$color8" textAlign="center">
                        Join us to start synchronizing your calendars seamlessly.
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

                    <YStack gap="$1.5">
                        <Text fontSize="$2" fontWeight="600" color="$color11" marginLeft="$1">
                            Confirm Password
                        </Text>
                        <Input
                            size="$4"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            backgroundColor="$color2"
                            borderColor="$color5"
                            focusStyle={{ borderColor: '$accent8' }}
                        />
                    </YStack>
                </YStack>

                <YStack gap="$4" marginTop="$4">
                    <Button
                        size="$4"
                        backgroundColor="$accent8"
                        borderRadius="$3"
                        pressStyle={{ opacity: 0.85, backgroundColor: '$accent9' }}
                        onPress={handleRegister}
                        disabled={isLoading}
                        opacity={isLoading ? 0.7 : 1}
                    >
                        {isLoading ? (
                            <Spinner color="#fff" />
                        ) : (
                            <Text fontSize="$3" fontWeight="700" color="#fff">
                                Register
                            </Text>
                        )}
                    </Button>

                    <XStack justifyContent="center" alignItems="center" gap="$2">
                        <Text color="$color8" fontSize="$3">
                            Already have an account?
                        </Text>
                        <Button
                            unstyled
                            pressStyle={{ opacity: 0.6 }}
                            onPress={() => router.replace('/')}
                        >
                            <Text color="$accent9" fontSize="$3" fontWeight="bold">
                                Login
                            </Text>
                        </Button>
                    </XStack>
                </YStack>
            </YStack>
        </YStack>
    );
}