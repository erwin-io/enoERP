import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { GoodsReceipt } from "./GoodsReceipt";
import { Item } from "./Item";

@Index("GoodsReceiptItem_pkey", ["goodsReceiptId", "itemId"], { unique: true })
@Entity("GoodsReceiptItem", { schema: "dbo" })
export class GoodsReceiptItem {
  @Column("bigint", { primary: true, name: "GoodsReceiptId" })
  goodsReceiptId: string;

  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "Quantity", default: () => "0" })
  quantity: string;

  @ManyToOne(
    () => GoodsReceipt,
    (goodsReceipt) => goodsReceipt.goodsReceiptItems
  )
  @JoinColumn([
    { name: "GoodsReceiptId", referencedColumnName: "goodsReceiptId" },
  ])
  goodsReceipt: GoodsReceipt;

  @ManyToOne(() => Item, (item) => item.goodsReceiptItems)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
