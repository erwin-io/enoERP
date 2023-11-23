import { Test, TestingModule } from "@nestjs/testing";
import { InventoryRequestRateService } from "./inventory-request-rate.service";

describe("InventoryRequestRateService", () => {
  let service: InventoryRequestRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryRequestRateService],
    }).compile();

    service = module.get<InventoryRequestRateService>(
      InventoryRequestRateService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
