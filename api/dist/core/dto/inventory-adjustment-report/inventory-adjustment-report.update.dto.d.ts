import { DefaultInventoryAdjustmentReportDto, InventoryAdjustmentReportItemDto } from "./inventory-adjustment-report-base.dto";
import { CreateInventoryAdjustmentReportItemDto } from "./inventory-adjustment-report.create.dto";
export declare class ReviewInventoryAdjustmentReportItemDto extends InventoryAdjustmentReportItemDto {
    proposedUnitReturnRate: number;
}
export declare class UpdateInventoryAdjustmentReportDto extends DefaultInventoryAdjustmentReportDto {
    inventoryAdjustmentReportItems: CreateInventoryAdjustmentReportItemDto[];
}
export declare class ProcessInventoryAdjustmentReportStatusDto {
    status: string;
    inventoryAdjustmentReportItems: ReviewInventoryAdjustmentReportItemDto[];
}
export declare class CloseInventoryAdjustmentReportStatusDto {
    status: "REJECTED" | "COMPLETED" | "CANCELLED";
    notes: string;
}
