import { Test, TestingModule } from '@nestjs/testing';
import { GoogleScheduleService } from './google-schedule.service';

describe('GoogleScheduleService', () => {
  let service: GoogleScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleScheduleService],
    }).compile();

    service = module.get<GoogleScheduleService>(GoogleScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
