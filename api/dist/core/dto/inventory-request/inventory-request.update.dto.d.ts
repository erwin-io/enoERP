import { DefaultInventoryRequestDto } from "./inventory-request-base.dto";
export declare class UpdateInventoryRequestDto extends DefaultInventoryRequestDto {
}
export declare class UpdateInventoryRequestStatusDto {
    status: "PENDING" | "REJECTED" | "PROCESSING" | "IN-TRANSIT" | "COMPLETED" | "CANCELLED" | "PARTIALLY-FULFILLED";
}
