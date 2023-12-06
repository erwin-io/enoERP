import { DefaultInventoryRequestDto } from "./inventory-request-base.dto";
export declare class UpdateInventoryRequestDto extends DefaultInventoryRequestDto {
    updatedByUserId: string;
}
export declare class ProcessInventoryRequestStatusDto {
    status: "PENDING" | "REJECTED" | "PROCESSING" | "IN-TRANSIT" | "COMPLETED" | "CANCELLED" | "PARTIALLY-FULFILLED";
    updatedByUserId: string;
}
export declare class CloseInventoryRequestStatusDto {
    status: "PENDING" | "REJECTED" | "PROCESSING" | "IN-TRANSIT" | "COMPLETED" | "CANCELLED" | "PARTIALLY-FULFILLED";
    notes: string;
    updatedByUserId: string;
}
