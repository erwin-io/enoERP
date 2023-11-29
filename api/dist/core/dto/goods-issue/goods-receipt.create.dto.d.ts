import { DefaultGoodsReceiptDto } from "./goods-issue-base.dto";
export declare class CreateGoodsReceiptDto extends DefaultGoodsReceiptDto {
    createdByUserId: string;
    warehouseCode: string;
}
