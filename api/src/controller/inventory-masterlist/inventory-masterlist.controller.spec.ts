import { Test, TestingModule } from "@nestjs/testing";
import { InventoryMasterlistController } from "./inventory-masterlist.controller";

describe("InventoryMasterlistController", () => {
  let controller: InventoryMasterlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryMasterlistController],
    }).compile();

    controller = module.get<InventoryMasterlistController>(
      InventoryMasterlistController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
