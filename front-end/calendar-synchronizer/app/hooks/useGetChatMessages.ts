import { useEffect, useState } from 'react';
import { MessageService } from '../services/messageService';
import { MessageDto } from '../api-client';

/**
 * Fetches chat message history.
 * Replace with real API call: GET /chat/messages
 */
export function useGetChatMessages() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageDto[]>([]);


    async function fetch() {
        setIsLoading(true)
        try {
            const data = await MessageService.findToday()
            setMessages(data)
            setIsError(false)
        } catch (err) {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetch()
    }, [])

    return { messages, setMessages, isLoading, isError };
}
