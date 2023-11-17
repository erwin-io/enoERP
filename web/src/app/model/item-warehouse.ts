import { Item } from "./item";
import { Warehouse } from "./warehouse";

export class ItemWarehouse {
  itemId: string;
  warehouseId: string;
  quantity: string;
  item: Item;
  warehouse: Warehouse;
}
