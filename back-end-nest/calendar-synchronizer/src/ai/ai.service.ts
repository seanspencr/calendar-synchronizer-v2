import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private api_key: string | undefined;
    private model_name: string | undefined;
    private api_url: string;

    constructor(private configService: ConfigService) {
        this.api_key = this.configService.get<string>('GOOGLE_AI_API_KEY')
        this.model_name = this.configService.get<string>('GOOGLE_AI_MODEL_NAME')
        
        if (!this.api_key || !this.model_name) {
            throw new Error('GOOGLE_API_KEY and GOOGLE_MODEL_NAME must be defined in environment variables');
        }
        
        this.api_url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model_name}:generateContent`;
    }

    async queryLM(query: string): Promise<string> {
        const response = await axios.post(
            this.api_url,
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
                    'X-goog-api-key': this.api_key,
                },
            },
        );
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    async queryLmForJson(query: string): Promise<string> {
        const response = await axios.post(
            this.api_url,
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
                    'X-goog-api-key': this.api_key,
                },
            },
        );
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
}