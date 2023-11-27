import { GoodsIssue } from "./GoodsIssue";
import { GoodsReceipt } from "./GoodsReceipt";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
import { InventoryRequest } from "./InventoryRequest";
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
    access: Access;
    branch: Branch;
}
