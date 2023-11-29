import { Item } from "./Item";
import { SalesInvoice } from "./SalesInvoice";
export declare class SalesInvoiceItem {
    salesInvoiceId: string;
    itemId: string;
    unitPrice: string;
    quantity: string;
    amount: string;
    item: Item;
    salesInvoice: SalesInvoice;
}
