import { GoodsIssue } from "./GoodsIssue";
import { GoodsReceipt } from "./GoodsReceipt";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { InventoryRequest } from "./InventoryRequest";
import { SalesInvoice } from "./SalesInvoice";
import { Access } from "./Access";
import { Branch } from "./Branch";
export declare class Users {
    userId: string;
    userName: string;
    password: string;
    fullName: string;
    gender: string;
    birthDate: string;
    mobileNumber: string;
    email: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string | null;
    address: string;
    goodsIssues: GoodsIssue[];
    goodsReceipts: GoodsReceipt[];
    inventoryAdjustmentReports: InventoryAdjustmentReport[];
    inventoryRequests: InventoryRequest[];
    salesInvoices: SalesInvoice[];
    access: Access;
    branch: Branch;
}
