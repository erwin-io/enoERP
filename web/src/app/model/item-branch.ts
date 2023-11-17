import { Branch } from "./branch";
import { Item } from "./item";

export class ItemBranch {
  itemId: string;
  branchId: string;
  quantity: string;
  branch: Branch;
  item: Item;
}
