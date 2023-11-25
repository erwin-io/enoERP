import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Supplier } from "./Supplier";
import { Warehouse } from "./Warehouse";
import { GoodsReceiptItem } from "./GoodsReceiptItem";

@Index("GoodsReceipt_pkey", ["goodsReceiptId"], { unique: true })
@Entity("GoodsReceipt", { schema: "dbo" })
export class GoodsReceipt {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GoodsReceiptId" })
  goodsReceiptId: string;

  @Column("character varying", { name: "GoodsReceiptCode", nullable: true })
  goodsReceiptCode: string | null;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("timestamp with time zone", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", {
    name: "Notes",
    nullable: true,
    default: () => "''",
  })
  notes: string | null;

  @ManyToOne(() => Users, (users) => users.goodsReceipts)
  @JoinColumn([{ name: "CreatedByUserId", referencedColumnName: "userId" }])
  createdByUser: Users;

  @ManyToOne(() => Supplier, (supplier) => supplier.goodsReceipts)
  @JoinColumn([{ name: "SupplierId", referencedColumnName: "supplierId" }])
  supplier: Supplier;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.goodsReceipts)
  @JoinColumn([{ name: "WarehouseId", referencedColumnName: "warehouseId" }])
  warehouse: Warehouse;

  @OneToMany(
    () => GoodsReceiptItem,
    (goodsReceiptItem) => goodsReceiptItem.goodsReceipt
  )
  goodsReceiptItems: GoodsReceiptItem[];
}
