import { Branch } from "./branch";
import { InventoryRequest } from "./inventory-request";
import { Item } from "./item";
import { Users } from "./users";
import { Warehouse } from "./warehouse";

export class InventoryAdjustmentReport {
  inventoryAdjustmentReportId: string;
  inventoryAdjustmentReportCode: string;
  reportType: "RETURN" | "DAMAGE" | "DISCREPANCY";
  description: string;
  dateReported: Date;
  dateLastUpdated: Date | null;
  reportStatus: "PENDING"
  | "REJECTED"
  | "REVIEWED"
  | "COMPLETED"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED";
  active: boolean;
  branch: Branch;
  reportedByUser: Users;
  inventoryAdjustmentReportItems: InventoryAdjustmentReportItem[];
  notes: string = "";
  inventoryRequest: InventoryRequest;
}
export class InventoryAdjustmentReportItem {
  returnedQuantity: string;
  totalRefund: string;
  proposedUnitReturnRate: string;
  inventoryAdjustmentReport: InventoryAdjustmentReport;
  item: Item;
}
