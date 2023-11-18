import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InventoryRequest } from "./InventoryRequest";
import { ItemBranch } from "./ItemBranch";
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
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.branch
  )
  inventoryRequests: InventoryRequest[];

  @OneToMany(() => ItemBranch, (itemBranch) => itemBranch.branch)
  itemBranches: ItemBranch[];

  @OneToMany(() => Users, (users) => users.branch)
  users: Users[];
}
