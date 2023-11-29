import { DefaultGoodsReceiptDto } from "./goods-receipt-base.dto";
export declare class CreateGoodsReceiptDto extends DefaultGoodsReceiptDto {
    createdByUserId: string;
    warehouseCode: string;
}
