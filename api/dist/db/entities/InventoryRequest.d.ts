import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { Branch } from "./Branch";
import { Warehouse } from "./Warehouse";
import { Users } from "./Users";
import { InventoryRequestItem } from "./InventoryRequestItem";
export declare class InventoryRequest {
    inventoryRequestId: string;
    inventoryRequestCode: string | null;
    description: string;
    dateRequested: Date;
    dateLastUpdated: Date | null;
    requestStatus: string;
    active: boolean;
    notes: string | null;
    inventoryAdjustmentReports: InventoryAdjustmentReport[];
    branch: Branch;
    fromWarehouse: Warehouse;
    lastUpdatedByUser: Users;
    requestedByUser: Users;
    inventoryRequestItems: InventoryRequestItem[];
}
