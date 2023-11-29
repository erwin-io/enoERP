import { Test, TestingModule } from "@nestjs/testing";
import { GoodsIssueController } from "./goods-issue.controller";

describe("GoodsIssueController", () => {
  let controller: GoodsIssueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsIssueController],
    }).compile();

    controller = module.get<GoodsIssueController>(GoodsIssueController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
