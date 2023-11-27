import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { Item } from "./Item";
export declare class InventoryAdjustmentReportItem {
    inventoryAdjustmentReportId: string;
    itemId: string;
    returnedQuantity: string;
    proposedUnitReturnRate: string;
    totalRefund: string;
    inventoryAdjustmentReport: InventoryAdjustmentReport;
    item: Item;
}
