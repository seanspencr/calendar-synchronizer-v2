import { useState, useCallback } from 'react';
import { CreateMessageDto, MessageDto } from '../api-client';
import { MessageService } from '../services/messageService';



/**
 * Sends a chat message and receives a dummy AI response.
 * Replace with real API call: POST /chat/messages
 */


export function useSendChatMessage(
  setMessages: React.Dispatch<React.SetStateAction<MessageDto[]>>,
) {
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)


  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true)
      const userMsg: MessageDto = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        message_type: 'PROMPT',
        prompt_type: null,
        content: content,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);


      try {
        const botResponse: MessageDto = await MessageService.createMessage({ content: content })
        setMessages((prev) => [...prev, botResponse]);

      } catch (err: any) {
        setError(err.message)

      } finally {

        setIsLoading(false)
        setIsTyping(false)
      }
    },

    [setMessages, responseIndex, error, isLoading],
  );

  return { sendMessage, isTyping, isLoading, error };
}
