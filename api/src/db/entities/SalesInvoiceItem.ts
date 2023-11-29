import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { SalesInvoice } from "./SalesInvoice";

@Index("SalesInvoiceItem_pkey", ["itemId", "salesInvoiceId"], { unique: true })
@Entity("SalesInvoiceItem", { schema: "dbo" })
export class SalesInvoiceItem {
  @Column("bigint", { primary: true, name: "SalesInvoiceId" })
  salesInvoiceId: string;

  @Column("bigint", { primary: true, name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "UnitPrice", default: () => "0" })
  unitPrice: string;

  @Column("numeric", { name: "Quantity", default: () => "0" })
  quantity: string;

  @Column("numeric", { name: "Amount", default: () => "0" })
  amount: string;

  @ManyToOne(() => Item, (item) => item.salesInvoiceItems)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;

  @ManyToOne(
    () => SalesInvoice,
    (salesInvoice) => salesInvoice.salesInvoiceItems
  )
  @JoinColumn([
    { name: "SalesInvoiceId", referencedColumnName: "salesInvoiceId" },
  ])
  salesInvoice: SalesInvoice;
}
