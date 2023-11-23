import { Branch } from "./branch";
import { Item } from "./item";
import { Users } from "./users";

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
  inventoryRequestItems: InventoryRequestItem[];
}
export class InventoryRequestItem {
  quantity: string;
  inventoryRequest: InventoryRequest;
  item: Item;
  totalAmount: number;
}
