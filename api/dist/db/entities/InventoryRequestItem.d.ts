import { InventoryRequest } from "./InventoryRequest";
import { Item } from "./Item";
export declare class InventoryRequestItem {
    inventoryRequestId: string;
    itemId: string;
    quantity: string;
    inventoryRequest: InventoryRequest;
    item: Item;
}
