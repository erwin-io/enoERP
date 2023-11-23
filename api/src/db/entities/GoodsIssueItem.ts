import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { GoodsIssue } from "./GoodsIssue";
import { Item } from "./Item";

@Index("GoodsIssueItem_pkey", ["goodsIssueId", "itemId"], { unique: true })
@Entity("GoodsIssueItem", { schema: "dbo" })
export class GoodsIssueItem {
  @Column("bigint", { primary: true, name: "GoodsIssueId" })
  goodsIssueId: string;

  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "Quantity", default: () => "0" })
  quantity: string;

  @ManyToOne(() => GoodsIssue, (goodsIssue) => goodsIssue.goodsIssueItems)
  @JoinColumn([{ name: "GoodsIssueId", referencedColumnName: "goodsIssueId" }])
  goodsIssue: GoodsIssue;

  @ManyToOne(() => Item, (item) => item.goodsIssueItems)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
