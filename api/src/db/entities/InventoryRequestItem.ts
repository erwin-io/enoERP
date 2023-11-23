import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryRequest } from "./InventoryRequest";
import { InventoryRequestRate } from "./InventoryRequestRate";
import { Item } from "./Item";

@Index("InventoryRequestItem_pkey", ["inventoryRequestId", "itemId"], {
  unique: true,
})
@Entity("InventoryRequestItem", { schema: "dbo" })
export class InventoryRequestItem {
  @Column("bigint", { primary: true, name: "InventoryRequestId" })
  inventoryRequestId: string;

  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "Quantity", default: () => "0" })
  quantity: string;

  @Column("numeric", { name: "TotalAmount", default: () => "0" })
  totalAmount: string;

  @ManyToOne(
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.inventoryRequestItems
  )
  @JoinColumn([
    { name: "InventoryRequestId", referencedColumnName: "inventoryRequestId" },
  ])
  inventoryRequest: InventoryRequest;

  @ManyToOne(
    () => InventoryRequestRate,
    (inventoryRequestRate) => inventoryRequestRate.inventoryRequestItems
  )
  @JoinColumn([
    {
      name: "InventoryRequestRateId",
      referencedColumnName: "inventoryRequestRateId",
    },
  ])
  inventoryRequestRate: InventoryRequestRate;

  @ManyToOne(() => Item, (item) => item.inventoryRequestItems)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
