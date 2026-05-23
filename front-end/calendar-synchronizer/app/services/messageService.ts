import { messagesApi } from "./apiService";
import { CreateUserDto, UserDto, CreateMessageDto, MessageDto } from '../api-client';

export const MessageService = {

    async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
        try {
            const response = await messagesApi.messagesControllerCreate(createMessageDto);
            return response.data;
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    },

    async findToday(): Promise<MessageDto[]> {
        try {
            const response = await messagesApi.messagesControllerFindToday();
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    },

};
