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
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";

@Index("GoodsIssue_pkey", ["goodsIssueId"], { unique: true })
@Entity("GoodsIssue", { schema: "dbo" })
export class GoodsIssue {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GoodsIssueId" })
  goodsIssueId: string;

  @Column("character varying", { name: "GoodsIssueCode", nullable: true })
  goodsIssueCode: string | null;

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

  @Column("character varying", { name: "Notes", nullable: true })
  notes: string | null;

  @ManyToOne(() => Users, (users) => users.goodsIssues)
  @JoinColumn([{ name: "CreatedByUserId", referencedColumnName: "userId" }])
  createdByUser: Users;

  @ManyToOne(() => Users, (users) => users.goodsIssues2)
  @JoinColumn([{ name: "LastUpdatedByUserId", referencedColumnName: "userId" }])
  lastUpdatedByUser: Users;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.goodsIssues)
  @JoinColumn([{ name: "WarehouseId", referencedColumnName: "warehouseId" }])
  warehouse: Warehouse;

  @OneToMany(
    () => GoodsIssueItem,
    (goodsIssueItem) => goodsIssueItem.goodsIssue
  )
  goodsIssueItems: GoodsIssueItem[];

  @OneToMany(
    () => InventoryAdjustmentReport,
    (inventoryAdjustmentReport) => inventoryAdjustmentReport.goodsIssue
  )
  inventoryAdjustmentReports: InventoryAdjustmentReport[];
}
