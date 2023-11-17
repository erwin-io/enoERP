import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItemBranch } from "./ItemBranch";

@Index("u_branch_branchCode", ["active", "branchCode"], { unique: true })
@Index("u_branch_name", ["active", "name"], { unique: true })
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

  @OneToMany(() => ItemBranch, (itemBranch) => itemBranch.branch)
  itemBranches: ItemBranch[];
}
