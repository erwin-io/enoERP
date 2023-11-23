import { InventoryRequest } from "./InventoryRequest";
import { InventoryRequestRate } from "./InventoryRequestRate";
import { Item } from "./Item";
export declare class InventoryRequestItem {
    inventoryRequestId: string;
    itemId: string;
    quantity: string;
    totalAmount: string;
    inventoryRequest: InventoryRequest;
    inventoryRequestRate: InventoryRequestRate;
    item: Item;
}
