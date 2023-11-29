import { Branch } from "./branch";
import { Item } from "./item";
import { Supplier } from "./supplier";
import { Users } from "./users";
import { Warehouse } from "./warehouse";

export class GoodsIssue {
  goodsIssueId: string;
  goodsIssueCode: string;
  description: string;
  dateCreated: Date;
  dateLastUpdated: Date;
  status: "PENDING"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";
  active: boolean;
  createdByUser: Users;
  warehouse: Warehouse;
  notes: string;
  goodsIssueItems: GoodsIssueItem[];
  issueType: "RETURN" | "DAMAGE" | "DISCREPANCY";
}
export class GoodsIssueItem {
  quantity: string;
  goodsIssue: GoodsIssue;
  item: Item;
}
