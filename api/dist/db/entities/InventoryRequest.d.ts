import { Branch } from "./Branch";
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
    branch: Branch;
    requestedByUser: Users;
    inventoryRequestItems: InventoryRequestItem[];
}
