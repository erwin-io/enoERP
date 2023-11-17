import { ItemWarehouse } from "./item-warehouse";

export class Warehouse {
  warehouseId: string;
  warehouseCode: string;
  name: string;
  active: boolean;
  itemWarehouses: ItemWarehouse[];
}
