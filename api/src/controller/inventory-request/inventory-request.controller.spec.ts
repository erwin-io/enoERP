import { Test, TestingModule } from "@nestjs/testing";
import { InventoryRequestController } from "./inventory-request.controller";

describe("InventoryRequestController", () => {
  let controller: InventoryRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryRequestController],
    }).compile();

    controller = module.get<InventoryRequestController>(
      InventoryRequestController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
