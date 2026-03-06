import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftScheduleService } from './microsoft-schedule.service';

describe('MicrosoftScheduleService', () => {
  let service: MicrosoftScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicrosoftScheduleService],
    }).compile();

    service = module.get<MicrosoftScheduleService>(MicrosoftScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
