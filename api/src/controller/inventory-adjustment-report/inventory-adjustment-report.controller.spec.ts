import { Test, TestingModule } from "@nestjs/testing";
import { InventoryAdjustmentReportController } from "./inventory-adjustment-report.controller";

describe("InventoryAdjustmentReportController", () => {
  let controller: InventoryAdjustmentReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryAdjustmentReportController],
    }).compile();

    controller = module.get<InventoryAdjustmentReportController>(
      InventoryAdjustmentReportController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
