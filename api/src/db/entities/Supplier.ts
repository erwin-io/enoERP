import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoodsReceipt } from "./GoodsReceipt";

@Index("u_supplier_name", ["active", "name"], { unique: true })
@Index("Supplier_pkey", ["supplierId"], { unique: true })
@Entity("Supplier", { schema: "dbo" })
export class Supplier {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SupplierId" })
  supplierId: string;

  @Column("character varying", { name: "SupplierCode", nullable: true })
  supplierCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => GoodsReceipt, (goodsReceipt) => goodsReceipt.supplier)
  goodsReceipts: GoodsReceipt[];
}
