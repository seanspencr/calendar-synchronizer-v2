import React, { useState, useRef } from 'react';
import { YStack, XStack, Text, Input, Button, ScrollView } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import type { ChatMessage } from './types';

interface ChatbotPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (content: string) => void;
}

/** Single chat bubble */
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <YStack
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxWidth="85%"
      marginVertical="$1"
    >
      <YStack
        backgroundColor={isUser ? '$accent7' : '$color3'}
        borderRadius="$4"
        borderBottomRightRadius={isUser ? '$1' : '$4'}
        borderBottomLeftRadius={isUser ? '$4' : '$1'}
        paddingHorizontal="$3"
        paddingVertical="$2"
      >
        <Text fontSize="$2" color={isUser ? '#fff' : '$color12'} lineHeight={20}>
          {message.content}
        </Text>
      </YStack>
      <Text
        fontSize={10}
        color="$color6"
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        marginTop="$1"
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </YStack>
  );
}

/** Typing indicator dots */
function TypingIndicator() {
  return (
    <XStack
      alignSelf="flex-start"
      backgroundColor="$color3"
      borderRadius="$4"
      paddingHorizontal="$3"
      paddingVertical="$2"
      gap="$1"
      marginVertical="$1"
    >
      <Text fontSize="$3" color="$color8">•••</Text>
    </XStack>
  );
}

/** Chatbot panel with message history and input */
export function ChatbotPanel({ messages, isTyping, onSend }: ChatbotPanelProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInputText('');
  };

  return (
    <YStack flex={1}>
      {/* Messages area */}
      <ScrollView
        ref={scrollRef}
        flex={1}
        paddingHorizontal="$3"
        paddingVertical="$2"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          // Auto-scroll to bottom on new messages
          scrollRef.current?.scrollToEnd?.({ animated: true });
        }}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Input bar */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderTopWidth={1}
        borderTopColor="$color3"
        gap="$2"
        alignItems="center"
      >
        <Input
          flex={1}
          size="$3"
          placeholder="Ask your assistant..."
          placeholderTextColor="$color6"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          backgroundColor="$color2"
          borderColor="$color4"
          color="$color12"
          borderRadius="$4"
        />
        <Button
          size="$3"
          circular
          backgroundColor="$accent7"
          onPress={handleSend}
          disabled={!inputText.trim()}
          opacity={inputText.trim() ? 1 : 0.4}
        >
          <Feather name="send" size={16} color="#fff" />
        </Button>
      </XStack>
    </YStack>
  );
}
