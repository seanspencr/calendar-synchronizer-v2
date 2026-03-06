import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftAuthService } from './microsoft-auth.service';

describe('MicrosoftAuthService', () => {
  let service: MicrosoftAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicrosoftAuthService],
    }).compile();

    service = module.get<MicrosoftAuthService>(MicrosoftAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
