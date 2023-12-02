import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { SalesInvoice } from "./SalesInvoice";

@Index("SalesInvoicePayments_pkey", ["paymentType", "salesInvoiceId"], {
  unique: true,
})
@Entity("SalesInvoicePayments", { schema: "dbo" })
export class SalesInvoicePayments {
  @Column("bigint", { primary: true, name: "SalesInvoiceId" })
  salesInvoiceId: string;

  @Column("character varying", { primary: true, name: "PaymentType" })
  paymentType: string;

  @Column("numeric", { name: "Amount", default: () => "0" })
  amount: string;

  @ManyToOne(
    () => SalesInvoice,
    (salesInvoice) => salesInvoice.salesInvoicePayments
  )
  @JoinColumn([
    { name: "SalesInvoiceId", referencedColumnName: "salesInvoiceId" },
  ])
  salesInvoice: SalesInvoice;
}
