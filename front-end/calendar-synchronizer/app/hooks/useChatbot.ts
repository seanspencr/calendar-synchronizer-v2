import { useState, useCallback } from 'react';
import type { ChatMessage } from '../components/dashboard/types';

/** Pre-seeded dummy responses the "LLM" will cycle through */
const DUMMY_RESPONSES = [
  'I can help you manage your calendar! Try asking me to create a new event or check your schedule.',
  'Your next meeting is "Strategy Hub Sync" on September 4th at 10:00 AM.',
  'You have 4 active tasks. Would you like me to summarize them?',
  'I\'ve noted that down. Is there anything else you\'d like to schedule?',
  'Based on your calendar, Wednesday afternoon looks free for a new meeting.',
];

export interface UseChatbotReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => void;
  clearHistory: () => void;
}

/**
 * Dummy hook for chatbot interactions.
 * Replace with real API integration using natural language schedule creation.
 */
export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your scheduling assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
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

      // Simulate LLM response delay
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
    [responseIndex],
  );

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your scheduling assistant. How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
    setResponseIndex(0);
  }, []);

  return { messages, isTyping, sendMessage, clearHistory };
}
