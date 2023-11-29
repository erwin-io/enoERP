import { DefaultGoodsReceiptDto } from "./goods-issue-base.dto";
export declare class UpdateGoodsReceiptDto extends DefaultGoodsReceiptDto {
}
export declare class UpdateGoodsReceiptStatusDto {
    status: "PENDING" | "REJECTED" | "COMPLETED" | "CANCELLED";
    notes: string;
}
