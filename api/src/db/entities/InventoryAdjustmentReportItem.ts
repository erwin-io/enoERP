import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { Item } from "./Item";

@Index(
  "InventoryAdjustmentReportItem_pkey",
  ["inventoryAdjustmentReportId", "itemId"],
  { unique: true }
)
@Entity("InventoryAdjustmentReportItem", { schema: "dbo" })
export class InventoryAdjustmentReportItem {
  @Column("bigint", { primary: true, name: "InventoryAdjustmentReportId" })
  inventoryAdjustmentReportId: string;

  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "ReturnedQuantity", default: () => "0" })
  returnedQuantity: string;

  @Column("numeric", { name: "ProposedUnitReturnRate", default: () => "0" })
  proposedUnitReturnRate: string;

  @Column("numeric", { name: "TotalRefund", default: () => "0" })
  totalRefund: string;

  @ManyToOne(
    () => InventoryAdjustmentReport,
    (inventoryAdjustmentReport) =>
      inventoryAdjustmentReport.inventoryAdjustmentReportItems
  )
  @JoinColumn([
    {
      name: "InventoryAdjustmentReportId",
      referencedColumnName: "inventoryAdjustmentReportId",
    },
  ])
  inventoryAdjustmentReport: InventoryAdjustmentReport;

  @ManyToOne(() => Item, (item) => item.inventoryAdjustmentReportItems)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
