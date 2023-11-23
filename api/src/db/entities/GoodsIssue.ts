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
import { Warehouse } from "./Warehouse";
import { GoodsIssueItem } from "./GoodsIssueItem";

@Index("GoodsIssue_pkey", ["goodsIssueId"], { unique: true })
@Entity("GoodsIssue", { schema: "dbo" })
export class GoodsIssue {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GoodsIssueId" })
  goodsIssueId: string;

  @Column("character varying", { name: "GoodsIssueCode" })
  goodsIssueCode: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("character varying", { name: "IssueType" })
  issueType: string;

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

  @ManyToOne(() => Users, (users) => users.goodsIssues)
  @JoinColumn([{ name: "CreatedByUserId", referencedColumnName: "userId" }])
  createdByUser: Users;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.goodsIssues)
  @JoinColumn([{ name: "WarehouseId", referencedColumnName: "warehouseId" }])
  warehouse: Warehouse;

  @OneToMany(
    () => GoodsIssueItem,
    (goodsIssueItem) => goodsIssueItem.goodsIssue
  )
  goodsIssueItems: GoodsIssueItem[];
}
