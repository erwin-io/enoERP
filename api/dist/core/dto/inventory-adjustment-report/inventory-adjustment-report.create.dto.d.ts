import { DefaultInventoryAdjustmentReportDto, InventoryAdjustmentReportItemDto } from "./inventory-adjustment-report-base.dto";
export declare class CreateInventoryAdjustmentReportItemDto extends InventoryAdjustmentReportItemDto {
    returnedQuantity: number;
}
export declare class CreateInventoryAdjustmentReportDto extends DefaultInventoryAdjustmentReportDto {
    reportedByUserId: string;
    inventoryRequestCode: string;
    inventoryAdjustmentReportItems: CreateInventoryAdjustmentReportItemDto[];
}
