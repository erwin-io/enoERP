import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Branch } from "./Branch";
import { Item } from "./Item";

@Index("ItemBranch_pkey", ["branchId", "itemId"], { unique: true })
@Entity("ItemBranch", { schema: "dbo" })
export class ItemBranch {
  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("bigint", { primary: true, name: "BranchId" })
  branchId: string;

  @Column("bigint", { name: "Quantity", default: () => "0" })
  quantity: string;

  @ManyToOne(() => Branch, (branch) => branch.itemBranches)
  @JoinColumn([{ name: "BranchId", referencedColumnName: "branchId" }])
  branch: Branch;

  @ManyToOne(() => Item, (item) => item.itemBranches)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
