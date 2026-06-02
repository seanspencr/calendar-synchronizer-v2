import { message_type, messages, prompt_type } from "src/generated/prisma/client";

export class MessageDto implements messages {
    id: string;
    created_at: Date;
    user_id: string;
    message_type: message_type;
    content: string;
    prompt_type: prompt_type | null;
}
