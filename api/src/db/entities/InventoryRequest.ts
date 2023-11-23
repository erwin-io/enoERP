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
import { Warehouse } from "./Warehouse";
import { Users } from "./Users";
import { InventoryRequestItem } from "./InventoryRequestItem";

@Index("InventoryRequest_pkey", ["inventoryRequestId"], { unique: true })
@Entity("InventoryRequest", { schema: "dbo" })
export class InventoryRequest {
  @PrimaryGeneratedColumn({ type: "bigint", name: "InventoryRequestId" })
  inventoryRequestId: string;

  @Column("character varying", { name: "InventoryRequestCode", nullable: true })
  inventoryRequestCode: string | null;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("timestamp with time zone", {
    name: "DateRequested",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateRequested: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("character varying", {
    name: "RequestStatus",
    default: () => "'PENDING'",
  })
  requestStatus: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Branch, (branch) => branch.inventoryRequests)
  @JoinColumn([{ name: "BranchId", referencedColumnName: "branchId" }])
  branch: Branch;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventoryRequests)
  @JoinColumn([
    { name: "FromWarehouseId", referencedColumnName: "warehouseId" },
  ])
  fromWarehouse: Warehouse;

  @ManyToOne(() => Users, (users) => users.inventoryRequests)
  @JoinColumn([{ name: "RequestedByUserId", referencedColumnName: "userId" }])
  requestedByUser: Users;

  @OneToMany(
    () => InventoryRequestItem,
    (inventoryRequestItem) => inventoryRequestItem.inventoryRequest
  )
  inventoryRequestItems: InventoryRequestItem[];
}
