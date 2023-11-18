import { Test, TestingModule } from '@nestjs/testing';
import { InventoryMasterlistService } from './inventory-masterlist.service';

describe('InventoryMasterlistService', () => {
  let service: InventoryMasterlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryMasterlistService],
    }).compile();

    service = module.get<InventoryMasterlistService>(InventoryMasterlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
