import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoodsIssueItem } from "./GoodsIssueItem";
import { GoodsReceiptItem } from "./GoodsReceiptItem";
import { InventoryAdjustmentReportItem } from "./InventoryAdjustmentReportItem";
import { InventoryRequestItem } from "./InventoryRequestItem";
import { InventoryRequestRate } from "./InventoryRequestRate";
import { ItemCategory } from "./ItemCategory";
import { ItemBranch } from "./ItemBranch";
import { ItemWarehouse } from "./ItemWarehouse";
import { SalesInvoiceItem } from "./SalesInvoiceItem";

@Index("u_item_itemCode", ["active", "itemCode"], { unique: true })
@Index("u_item_itemName", ["active", "itemName"], { unique: true })
@Index("Item_pkey", ["itemId"], { unique: true })
@Entity("Item", { schema: "dbo" })
export class Item {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ItemId" })
  itemId: string;

  @Column("character varying", { name: "ItemCode" })
  itemCode: string;

  @Column("character varying", { name: "ItemName" })
  itemName: string;

  @Column("character varying", { name: "ItemDescription", default: () => "''" })
  itemDescription: string;

  @Column("numeric", { name: "Price", default: () => "0" })
  price: string;

  @Column("date", { name: "DateAdded", default: () => "now()" })
  dateAdded: string;

  @Column("date", { name: "DateLastUpdated", nullable: true })
  dateLastUpdated: string | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => GoodsIssueItem, (goodsIssueItem) => goodsIssueItem.item)
  goodsIssueItems: GoodsIssueItem[];

  @OneToMany(
    () => GoodsReceiptItem,
    (goodsReceiptItem) => goodsReceiptItem.item
  )
  goodsReceiptItems: GoodsReceiptItem[];

  @OneToMany(
    () => InventoryAdjustmentReportItem,
    (inventoryAdjustmentReportItem) => inventoryAdjustmentReportItem.item
  )
  inventoryAdjustmentReportItems: InventoryAdjustmentReportItem[];

  @OneToMany(
    () => InventoryRequestItem,
    (inventoryRequestItem) => inventoryRequestItem.item
  )
  inventoryRequestItems: InventoryRequestItem[];

  @OneToMany(
    () => InventoryRequestRate,
    (inventoryRequestRate) => inventoryRequestRate.item
  )
  inventoryRequestRates: InventoryRequestRate[];

  @ManyToOne(() => ItemCategory, (itemCategory) => itemCategory.items)
  @JoinColumn([
    { name: "ItemCategoryId", referencedColumnName: "itemCategoryId" },
  ])
  itemCategory: ItemCategory;

  @OneToMany(() => ItemBranch, (itemBranch) => itemBranch.item)
  itemBranches: ItemBranch[];

  @OneToMany(() => ItemWarehouse, (itemWarehouse) => itemWarehouse.item)
  itemWarehouses: ItemWarehouse[];

  @OneToMany(
    () => SalesInvoiceItem,
    (salesInvoiceItem) => salesInvoiceItem.item
  )
  salesInvoiceItems: SalesInvoiceItem[];
}
