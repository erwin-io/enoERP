import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { Warehouse } from "./Warehouse";

@Index("ItemWarehouse_pkey", ["itemId", "warehouseId"], { unique: true })
@Entity("ItemWarehouse", { schema: "dbo" })
export class ItemWarehouse {
  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("bigint", { primary: true, name: "WarehouseId" })
  warehouseId: string;

  @Column("bigint", { name: "Quantity", default: () => "0" })
  quantity: string;

  @Column("bigint", { name: "OrderedQuantity", default: () => "0" })
  orderedQuantity: string;

  @ManyToOne(() => Item, (item) => item.itemWarehouses)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.itemWarehouses)
  @JoinColumn([{ name: "WarehouseId", referencedColumnName: "warehouseId" }])
  warehouse: Warehouse;
}
