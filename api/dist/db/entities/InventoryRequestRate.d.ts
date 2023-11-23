import { InventoryRequestItem } from "./InventoryRequestItem";
import { Item } from "./Item";
export declare class InventoryRequestRate {
    inventoryRequestRateId: string;
    rate: string;
    rateName: string;
    minQuantity: string;
    maxQuantity: string;
    active: boolean;
    baseRate: boolean;
    inventoryRequestRateCode: string | null;
    inventoryRequestItems: InventoryRequestItem[];
    item: Item;
}
