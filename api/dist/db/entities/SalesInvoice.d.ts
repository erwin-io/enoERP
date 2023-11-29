import { Branch } from "./Branch";
import { Users } from "./Users";
import { SalesInvoiceItem } from "./SalesInvoiceItem";
export declare class SalesInvoice {
    salesInvoiceId: string;
    salesInvoiceCode: string | null;
    salesDate: Date;
    totalAmount: string;
    isVoid: boolean;
    dateLastUpdated: Date | null;
    branch: Branch;
    createdByUser: Users;
    salesInvoiceItems: SalesInvoiceItem[];
}
