import { InventoryRequest } from "./InventoryRequest";
import { ItemBranch } from "./ItemBranch";
import { Users } from "./Users";
export declare class Branch {
    branchId: string;
    branchCode: string;
    name: string;
    active: boolean;
    isMainBranch: boolean;
    inventoryRequests: InventoryRequest[];
    itemBranches: ItemBranch[];
    users: Users[];
}
