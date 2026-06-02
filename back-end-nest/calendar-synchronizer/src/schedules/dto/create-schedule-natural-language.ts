import { ApiProperty } from "@nestjs/swagger";

export class CreateScheduleNaturalLanguageDto {
    @ApiProperty()
    query: string;
}