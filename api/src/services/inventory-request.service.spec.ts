import { Test, TestingModule } from '@nestjs/testing';
import { InventoryRequestService } from './inventory-request.service';

describe('InventoryRequestService', () => {
  let service: InventoryRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryRequestService],
    }).compile();

    service = module.get<InventoryRequestService>(InventoryRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
