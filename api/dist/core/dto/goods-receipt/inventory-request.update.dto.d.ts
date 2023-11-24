import { DefaultInventoryRequestDto } from "./goods-receipt-base.dto";
export declare class UpdateInventoryRequestDto extends DefaultInventoryRequestDto {
}
export declare class ProcessInventoryRequestStatusDto {
    status: "PENDING" | "REJECTED" | "PROCESSING" | "IN-TRANSIT" | "COMPLETED" | "CANCELLED" | "PARTIALLY-FULFILLED";
}
export declare class CloseInventoryRequestStatusDto {
    status: "PENDING" | "REJECTED" | "PROCESSING" | "IN-TRANSIT" | "COMPLETED" | "CANCELLED" | "PARTIALLY-FULFILLED";
    notes: string;
}
