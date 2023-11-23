import { Item } from "./Item";
import { Warehouse } from "./Warehouse";
export declare class ItemWarehouse {
    itemId: string;
    warehouseId: string;
    quantity: string;
    orderedQuantity: string;
    item: Item;
    warehouse: Warehouse;
}
