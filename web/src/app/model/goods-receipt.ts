import { Branch } from "./branch";
import { Item } from "./item";
import { Users } from "./users";
import { Warehouse } from "./warehouse";

export class GoodsReceipt {
  goodsReceiptId: string;
  goodsReceiptCode: string;
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
  goodsReceiptItems: GoodsReceiptItem[];
}
export class GoodsReceiptItem {
  quantity: string;
  goodsReceipt: GoodsReceipt;
  item: Item;
}
