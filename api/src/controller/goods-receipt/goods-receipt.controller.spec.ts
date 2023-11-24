import { Test, TestingModule } from "@nestjs/testing";
import { GoodsReceiptController } from "./goods-receipt.controller";

describe("GoodsReceiptController", () => {
  let controller: GoodsReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsReceiptController],
    }).compile();

    controller = module.get<GoodsReceiptController>(GoodsReceiptController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
