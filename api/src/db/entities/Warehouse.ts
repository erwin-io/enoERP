import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItemWarehouse } from "./ItemWarehouse";

@Index("u_warehouse_warehouseCode", ["active", "warehouseCode"], {
  unique: true,
})
@Index("u_warehouse_name", ["active", "name"], { unique: true })
@Index("Warehouse_pkey", ["warehouseId"], { unique: true })
@Entity("Warehouse", { schema: "dbo" })
export class Warehouse {
  @PrimaryGeneratedColumn({ type: "bigint", name: "WarehouseId" })
  warehouseId: string;

  @Column("character varying", { name: "WarehouseCode" })
  warehouseCode: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => ItemWarehouse, (itemWarehouse) => itemWarehouse.warehouse)
  itemWarehouses: ItemWarehouse[];
}
