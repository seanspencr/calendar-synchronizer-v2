import { useState } from 'react';
import type { ChatMessage } from '../components/dashboard/types';

/**
 * Fetches chat message history.
 * Replace with real API call: GET /chat/messages
 */
export function useGetChatMessages() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm your scheduling assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
        },
    ]);

    return { messages, setMessages };
}
