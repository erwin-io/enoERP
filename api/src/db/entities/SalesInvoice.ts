import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "./Branch";
import { Users } from "./Users";
import { SalesInvoiceItem } from "./SalesInvoiceItem";
import { SalesInvoicePayments } from "./SalesInvoicePayments";

@Index("SalesInvoice_pkey", ["salesInvoiceId"], { unique: true })
@Entity("SalesInvoice", { schema: "dbo" })
export class SalesInvoice {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SalesInvoiceId" })
  salesInvoiceId: string;

  @Column("character varying", { name: "SalesInvoiceCode", nullable: true })
  salesInvoiceCode: string | null;

  @Column("timestamp with time zone", {
    name: "SalesDate",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  salesDate: Date;

  @Column("numeric", { name: "TotalAmount", default: () => "0" })
  totalAmount: string;

  @Column("boolean", { name: "IsVoid", default: () => "false" })
  isVoid: boolean;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @ManyToOne(() => Branch, (branch) => branch.salesInvoices)
  @JoinColumn([{ name: "BranchId", referencedColumnName: "branchId" }])
  branch: Branch;

  @ManyToOne(() => Users, (users) => users.salesInvoices)
  @JoinColumn([{ name: "CreatedByUserId", referencedColumnName: "userId" }])
  createdByUser: Users;

  @OneToMany(
    () => SalesInvoiceItem,
    (salesInvoiceItem) => salesInvoiceItem.salesInvoice
  )
  salesInvoiceItems: SalesInvoiceItem[];

  @OneToMany(
    () => SalesInvoicePayments,
    (salesInvoicePayments) => salesInvoicePayments.salesInvoice
  )
  salesInvoicePayments: SalesInvoicePayments[];
}
