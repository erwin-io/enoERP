import { DefaultGoodsReceiptDto } from "./goods-receipt-base.dto";
export declare class UpdateGoodsReceiptDto extends DefaultGoodsReceiptDto {
}
export declare class UpdateGoodsReceiptStatusDto {
    status: "PENDING" | "REJECTED" | "COMPLETED" | "CANCELLED";
    notes: string;
}
