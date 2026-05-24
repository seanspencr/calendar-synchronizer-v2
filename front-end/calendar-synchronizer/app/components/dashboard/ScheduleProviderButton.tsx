import { Button, Image, Text, XStack } from "tamagui";
import React, { useState, useCallback } from 'react';
export interface ScheduleProviderButtonProps {
    provider: 'GOOGLE' | 'MICROSOFT';
    onPress: (() => void) |  undefined;
}
export function ScheduleProviderButton({onPress, provider} : ScheduleProviderButtonProps) {
    
    if (provider === 'GOOGLE') {
        return (
            <Button
                onPress={onPress}
                backgroundColor="rgba(255,255,255,0.06)"
                borderWidth={0.5}
                borderColor="rgba(255,255,255,0.12)"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2.5"
                pressStyle={{
                backgroundColor: "rgba(255,255,255,0.11)",
                borderColor: "rgba(66,133,244,0.5)",
                scale: 0.985,
                }}
                hoverStyle={{
                backgroundColor: "rgba(255,255,255,0.11)",
                borderColor: "rgba(66,133,244,0.4)",
                }}
            >
                <XStack alignItems="center" gap="$2.5" flex={1}>
                {/* Google icon container */}
                <XStack
                    width={28}
                    height={28}
                    borderRadius="$2"
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Image
                    src={"https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" }
                    width={17}
                    height={17}
                    />
                </XStack>
                <Text flex={1} fontSize="$3" fontWeight="500" color="$color11" textAlign="left">
                    Sync with Google
                </Text>
                <Text color="$color8" fontSize="$4">›</Text>
                </XStack>
            </Button>
        )
    }
    else if(provider === "MICROSOFT"){
        return (
            <Button
                onPress={onPress}
                backgroundColor="rgba(255,255,255,0.06)"
                borderWidth={0.5}
                borderColor="rgba(255,255,255,0.12)"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2.5"
                pressStyle={{
                backgroundColor: "rgba(255,255,255,0.11)",
                borderColor: "rgba(0,120,212,0.5)",
                scale: 0.985,
                }}
                hoverStyle={{
                backgroundColor: "rgba(255,255,255,0.11)",
                borderColor: "rgba(0,120,212,0.4)",
                }}
            >
                <XStack alignItems="center" gap="$2.5" flex={1}>
                {/* Microsoft 4-square icon */}
                <XStack
                    width={28}
                    height={28}
                    borderRadius="$2"
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center"
                >
                    <XStack flexWrap="wrap" width={17} height={17}>
                    <XStack width={8} height={8} backgroundColor="#F35325" />
                    <XStack width={1} height={8} />
                    <XStack width={8} height={8} backgroundColor="#81BC06" />
                    <XStack width={8} height={8} backgroundColor="#05A6F0" />
                    <XStack width={1} height={8} />
                    <XStack width={8} height={8} backgroundColor="#FFBA08" />
                    </XStack>
                </XStack>
                <Text flex={1} fontSize="$3" fontWeight="500" color="$color11" textAlign="left">
                    Sync with Microsoft
                </Text>
                <Text color="$color8" fontSize="$4">›</Text>
                </XStack>
            </Button>
        )
    }
    else{
        return (
            <Button>
                <Text>Provider unknown</Text>
            </Button>
        )
    }
}