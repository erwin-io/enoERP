import { DefaultGoodsIssueDto } from "./goods-issue-base.dto";
export declare class CreateGoodsIssueDto extends DefaultGoodsIssueDto {
    createdByUserId: string;
    warehouseCode: string;
}
