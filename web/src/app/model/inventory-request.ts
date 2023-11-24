import { Branch } from "./branch";
import { InventoryRequestRate } from "./inventory-request-rate";
import { Item } from "./item";
import { Users } from "./users";
import { Warehouse } from "./warehouse";

export class InventoryRequest {
  inventoryRequestId: string;
  inventoryRequestCode: string;
  description: string;
  dateRequested: Date;
  dateLastUpdated: Date | null;
  requestStatus: "PENDING"
  | "REJECTED"
  | "PROCESSING"
  | "IN-TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY-FULFILLED";
  active: boolean;
  branch: Branch;
  requestedByUser: Users;
  fromWarehouse: Warehouse;
  inventoryRequestItems: InventoryRequestItem[];
}
export class InventoryRequestItem {
  quantity: string;
  inventoryRequest: InventoryRequest;
  item: Item;
  totalAmount: number;
  inventoryRequestRate: InventoryRequestRate;
}
