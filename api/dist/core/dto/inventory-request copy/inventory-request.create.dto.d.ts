import { DefaultInventoryRequestDto } from "./inventory-request-base.dto";
export declare class CreateInventoryRequestDto extends DefaultInventoryRequestDto {
    requestedByUserId: string;
    branchId: string;
    fromWarehouseCode: string;
}
