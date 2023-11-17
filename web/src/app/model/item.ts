import { ItemBranch } from "./item-branch";
import { ItemCategory } from "./item-category";
import { ItemWarehouse } from "./item-warehouse";

export class Item {
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
