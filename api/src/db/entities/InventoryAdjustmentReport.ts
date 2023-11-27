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
import { InventoryRequest } from "./InventoryRequest";
import { Users } from "./Users";
import { InventoryAdjustmentReportItem } from "./InventoryAdjustmentReportItem";

@Index("InventoryAdjustmentReport_pkey", ["inventoryAdjustmentReportId"], {
  unique: true,
})
@Entity("InventoryAdjustmentReport", { schema: "dbo" })
export class InventoryAdjustmentReport {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "InventoryAdjustmentReportId",
  })
  inventoryAdjustmentReportId: string;

  @Column("character varying", {
    name: "InventoryAdjustmentReportCode",
    nullable: true,
  })
  inventoryAdjustmentReportCode: string | null;

  @Column("character varying", { name: "ReportType" })
  reportType: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("timestamp with time zone", {
    name: "DateReported",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateReported: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("character varying", {
    name: "ReportStatus",
    default: () => "'OPEN'",
  })
  reportStatus: string;

  @Column("character varying", { name: "Notes", nullable: true })
  notes: string | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Branch, (branch) => branch.inventoryAdjustmentReports)
  @JoinColumn([{ name: "BranchId", referencedColumnName: "branchId" }])
  branch: Branch;

  @ManyToOne(
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.inventoryAdjustmentReports
  )
  @JoinColumn([
    { name: "InventoryRequestId", referencedColumnName: "inventoryRequestId" },
  ])
  inventoryRequest: InventoryRequest;

  @ManyToOne(() => Users, (users) => users.inventoryAdjustmentReports)
  @JoinColumn([{ name: "ReportedByUserId", referencedColumnName: "userId" }])
  reportedByUser: Users;

  @OneToMany(
    () => InventoryAdjustmentReportItem,
    (inventoryAdjustmentReportItem) =>
      inventoryAdjustmentReportItem.inventoryAdjustmentReport
  )
  inventoryAdjustmentReportItems: InventoryAdjustmentReportItem[];
}
