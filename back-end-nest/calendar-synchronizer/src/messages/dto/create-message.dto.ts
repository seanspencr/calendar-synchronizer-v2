
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { message_type, messages } from "src/generated/prisma/client";
import { messagesCreateInput } from "src/generated/prisma/models";
import type { NLP_MODELS } from 'src/lib/nlp_models';

export class CreateMessageDto implements Partial<messages> {
    content: string;
    @ApiProperty({ required: false })
    model?: NLP_MODELS;
}
