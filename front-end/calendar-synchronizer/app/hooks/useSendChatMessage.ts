import { useState, useCallback } from 'react';
import type { ChatMessage } from '../components/dashboard/types';

const DUMMY_RESPONSES = [
  'I can help you manage your calendar! Try asking me to create a new event.',
  'Your next meeting is "Strategy Hub Sync" on September 4th at 10:00 AM.',
  'You have 4 active tasks. Would you like me to summarize them?',
  "I've noted that down. Is there anything else you'd like to schedule?",
  'Based on your calendar, Wednesday afternoon looks free for a new meeting.',
];

/**
 * Sends a chat message and receives a dummy AI response.
 * Replace with real API call: POST /chat/messages
 */
export function useSendChatMessage(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) {
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);

  const sendMessage = useCallback(
    (content: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: DUMMY_RESPONSES[responseIndex % DUMMY_RESPONSES.length],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setResponseIndex((prev) => prev + 1);
        setIsTyping(false);
      }, 1200);
    },
    [setMessages, responseIndex],
  );

  return { sendMessage, isTyping };
}
