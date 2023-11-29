import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { InventoryRequest } from "./InventoryRequest";
import { ItemBranch } from "./ItemBranch";
import { SalesInvoice } from "./SalesInvoice";
import { Users } from "./Users";

@Index("u_branch_name", ["active", "name"], { unique: true })
@Index("u_branch_branchCode", ["active", "branchCode"], { unique: true })
@Index("Branch_pkey", ["branchId"], { unique: true })
@Entity("Branch", { schema: "dbo" })
export class Branch {
  @PrimaryGeneratedColumn({ type: "bigint", name: "BranchId" })
  branchId: string;

  @Column("character varying", { name: "BranchCode" })
  branchCode: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("boolean", { name: "IsMainBranch", default: () => "false" })
  isMainBranch: boolean;

  @OneToMany(
    () => InventoryAdjustmentReport,
    (inventoryAdjustmentReport) => inventoryAdjustmentReport.branch
  )
  inventoryAdjustmentReports: InventoryAdjustmentReport[];

  @OneToMany(
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.branch
  )
  inventoryRequests: InventoryRequest[];

  @OneToMany(() => ItemBranch, (itemBranch) => itemBranch.branch)
  itemBranches: ItemBranch[];

  @OneToMany(() => SalesInvoice, (salesInvoice) => salesInvoice.branch)
  salesInvoices: SalesInvoice[];

  @OneToMany(() => Users, (users) => users.branch)
  users: Users[];
}
