import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NLP_MODELS } from '../lib/nlp_models';
import { CreateScheduleDto } from 'src/schedules/dto/create-schedule.dto';
import { LlmResponseDto } from 'src/messages/dto/llm-response.dto';

@Injectable()
export class AiService {
    private apiKey: string | undefined;
    private modelName: string | undefined;
    private apiUrl: string;
    private nlpApiUrl: string;
    

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY')
        this.modelName = this.configService.get<string>('GOOGLE_AI_MODEL_NAME')
        this.nlpApiUrl = this.configService.get<string>('AI_API_URL')!

        if (!this.apiKey || !this.modelName) {
            throw new Error('GOOGLE_API_KEY and GOOGLE_MODEL_NAME must be defined in environment variables');
        }
        
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
    }

    async queryLM(query: string): Promise<string> {
        const response = await axios.post(
            this.apiUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: query,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': this.apiKey,
                },
            },
        );
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    async queryLmForJson(query: string): Promise<string> {
        const response = await axios.post(
            this.apiUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: query,
                            },
                        ],
                },
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': this.apiKey,
                },
            },
        );
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }


    async classifyWithNLPModel(text: string, model: NLP_MODELS): Promise<LlmResponseDto> {
        const response = await axios.post(
            `${this.nlpApiUrl}/predict/${model}`,
            {
                text: text
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        if(!response.data) {
            throw new Error('Failed to classify text with NLP model');
        }
        return response.data;
    }

}