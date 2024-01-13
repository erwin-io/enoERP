import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GatewayConnectedUsers } from "./GatewayConnectedUsers";
import { GoodsIssue } from "./GoodsIssue";
import { GoodsReceipt } from "./GoodsReceipt";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { InventoryRequest } from "./InventoryRequest";
import { Notifications } from "./Notifications";
import { SalesInvoice } from "./SalesInvoice";
import { Access } from "./Access";
import { Branch } from "./Branch";

@Index("u_user_number", ["active", "mobileNumber"], { unique: true })
@Index("u_user_email", ["active", "email"], { unique: true })
@Index("u_user", ["active", "userName"], { unique: true })
@Index("pk_users_1557580587", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("character varying", { name: "UserName" })
  userName: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "FullName" })
  fullName: string;

  @Column("character varying", { name: "Gender", default: () => "'Others'" })
  gender: string;

  @Column("date", { name: "BirthDate" })
  birthDate: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @Column("character varying", { name: "Email" })
  email: string;

  @Column("boolean", { name: "AccessGranted" })
  accessGranted: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "UserCode", nullable: true })
  userCode: string | null;

  @Column("character varying", { name: "Address", default: () => "'NA'" })
  address: string;

  @OneToMany(
    () => GatewayConnectedUsers,
    (gatewayConnectedUsers) => gatewayConnectedUsers.user
  )
  gatewayConnectedUsers: GatewayConnectedUsers[];

  @OneToMany(() => GoodsIssue, (goodsIssue) => goodsIssue.createdByUser)
  goodsIssues: GoodsIssue[];

  @OneToMany(() => GoodsIssue, (goodsIssue) => goodsIssue.lastUpdatedByUser)
  goodsIssues2: GoodsIssue[];

  @OneToMany(() => GoodsReceipt, (goodsReceipt) => goodsReceipt.createdByUser)
  goodsReceipts: GoodsReceipt[];

  @OneToMany(
    () => GoodsReceipt,
    (goodsReceipt) => goodsReceipt.lastUpdatedByUser
  )
  goodsReceipts2: GoodsReceipt[];

  @OneToMany(
    () => InventoryAdjustmentReport,
    (inventoryAdjustmentReport) => inventoryAdjustmentReport.reportedByUser
  )
  inventoryAdjustmentReports: InventoryAdjustmentReport[];

  @OneToMany(
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.lastUpdatedByUser
  )
  inventoryRequests: InventoryRequest[];

  @OneToMany(
    () => InventoryRequest,
    (inventoryRequest) => inventoryRequest.requestedByUser
  )
  inventoryRequests2: InventoryRequest[];

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  @OneToMany(() => SalesInvoice, (salesInvoice) => salesInvoice.createdByUser)
  salesInvoices: SalesInvoice[];

  @ManyToOne(() => Access, (access) => access.users)
  @JoinColumn([{ name: "AccessId", referencedColumnName: "accessId" }])
  access: Access;

  @ManyToOne(() => Branch, (branch) => branch.users)
  @JoinColumn([{ name: "BranchId", referencedColumnName: "branchId" }])
  branch: Branch;
}
