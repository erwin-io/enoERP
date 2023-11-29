import { DefaultGoodsIssueDto } from "./goods-issue-base.dto";
export declare class UpdateGoodsIssueDto extends DefaultGoodsIssueDto {
}
export declare class UpdateGoodsIssueStatusDto {
    status: "PENDING" | "REJECTED" | "COMPLETED" | "CANCELLED";
    notes: string;
}
