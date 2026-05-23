
import { message_type, messages } from "src/generated/prisma/client";
import { messagesCreateInput } from "src/generated/prisma/models";

export class CreateMessageDto implements Partial<messages> {
    content: string;
}
