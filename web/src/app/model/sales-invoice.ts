import { Branch } from "./branch";
import { Item } from "./item";
import { Users } from "./users";

export class SalesInvoice {
  salesInvoiceId: string;
  salesInvoiceCode: string;
  salesDate: Date;
  dateLastUpdated: Date;
  totalAmount: string;
  isVoid: boolean;
  active: boolean;
  createdByUser: Users;
  branch: Branch;
  salesInvoiceItems: SalesInvoiceItem[];
}
export class SalesInvoiceItem {
  quantity: string;
  amount: string;
  unitPrice: string;
  salesInvoice: SalesInvoice;
  item: Item;
}
