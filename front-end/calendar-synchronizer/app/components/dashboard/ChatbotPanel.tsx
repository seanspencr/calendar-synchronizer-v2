import React, { useState, useRef } from 'react';
import { YStack, XStack, Text, Input, Button, ScrollView, Select, Adapt, Sheet } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { MessageDto } from '@/app/api-client';
import { NLP_MODELS } from '@/app/lib/nlp_models';

const MODEL_OPTIONS: { label: string; value: NLP_MODELS }[] = [
  { label: "CRF", value: "crf" },
  { label: "CRF + TF-IDF", value: "crf-tf-idf" },
  { label: "spaCy", value: "spacy" },
  { label: "Naive Bayes", value: "naive-bayes" },
  { label: "SVM", value: "svm" },
  { label: "LLM", value: "llm" },
];

interface ChatbotPanelProps {
  messages: MessageDto[];
  isTyping: boolean;
  onSend: (content: string, model: NLP_MODELS) => void;
}

function ChatBubble({ message }: { message: MessageDto }) {
  const isUser = message.message_type === 'PROMPT';
  return (
    <YStack alignSelf={isUser ? 'flex-end' : 'flex-start'} maxWidth="85%" marginVertical="$1">
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
      <Text fontSize={10} color="$color6" alignSelf={isUser ? 'flex-end' : 'flex-start'} marginTop="$1">
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </YStack>
  );
}

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

export function ChatbotPanel({ messages, isTyping, onSend }: ChatbotPanelProps) {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<NLP_MODELS>('llm');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSend(trimmed, selectedModel);
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
        onContentSizeChange={() => scrollRef.current?.scrollToEnd?.({ animated: true })}
      >
        {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Input bar */}
      <YStack borderTopWidth={1} borderTopColor="$color3">
        {/* Model selector */}
        <XStack paddingHorizontal="$3" paddingTop="$2">
          <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val as NLP_MODELS)}>
            <Select.Trigger flex={1} iconAfter={<Feather name="chevron-down" size={14} />}>
              <Select.Value placeholder="Select model" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet modal dismissOnSnapToBottom>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content>
              <Select.ScrollUpButton />
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>NLP Model</Select.Label>
                  {MODEL_OPTIONS.map((option, index) => (
                    <Select.Item key={option.value} index={index} value={option.value}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select>
        </XStack>

        {/* Text input + send */}
        <XStack paddingHorizontal="$3" paddingVertical="$2" gap="$2" alignItems="center">
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
    </YStack>
  );
}