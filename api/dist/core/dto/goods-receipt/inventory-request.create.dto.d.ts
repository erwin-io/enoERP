import { DefaultInventoryRequestDto } from "./goods-receipt-base.dto";
export declare class CreateInventoryRequestDto extends DefaultInventoryRequestDto {
    requestedByUserId: string;
    branchId: string;
    fromWarehouseCode: string;
}
