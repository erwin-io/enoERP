import { Test, TestingModule } from "@nestjs/testing";
import { InventoryRequestRateController } from "./inventory-request-rate.controller";

describe("InventoryRequestRateController", () => {
  let controller: InventoryRequestRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryRequestRateController],
    }).compile();

    controller = module.get<InventoryRequestRateController>(InventoryRequestRateController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
