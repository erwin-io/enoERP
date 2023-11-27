import { Branch } from "./Branch";
import { InventoryRequest } from "./InventoryRequest";
import { Users } from "./Users";
import { InventoryAdjustmentReportItem } from "./InventoryAdjustmentReportItem";
export declare class InventoryAdjustmentReport {
    inventoryAdjustmentReportId: string;
    inventoryAdjustmentReportCode: string | null;
    reportType: string;
    description: string;
    dateReported: Date;
    dateLastUpdated: Date | null;
    reportStatus: string;
    notes: string | null;
    active: boolean;
    branch: Branch;
    inventoryRequest: InventoryRequest;
    reportedByUser: Users;
    inventoryAdjustmentReportItems: InventoryAdjustmentReportItem[];
}
