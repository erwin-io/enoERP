import { DefaultGoodsReceiptDto } from "./goods-receipt-base.dto";
export declare class UpdateGoodsReceiptDto extends DefaultGoodsReceiptDto {
    updatedByUserId: string;
}
export declare class UpdateGoodsReceiptStatusDto {
    status: "PENDING" | "REJECTED" | "COMPLETED" | "CANCELLED";
    notes: string;
    updatedByUserId: string;
}
