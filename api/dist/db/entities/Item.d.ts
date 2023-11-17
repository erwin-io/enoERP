import { ItemCategory } from "./ItemCategory";
import { ItemBranch } from "./ItemBranch";
import { ItemWarehouse } from "./ItemWarehouse";
export declare class Item {
    itemId: string;
    itemCode: string;
    itemName: string;
    itemDescription: string;
    price: string;
    dateAdded: string;
    dateLastUpdated: string | null;
    active: boolean;
    itemCategory: ItemCategory;
    itemBranches: ItemBranch[];
    itemWarehouses: ItemWarehouse[];
}
