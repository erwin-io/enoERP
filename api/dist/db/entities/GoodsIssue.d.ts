import { Users } from "./Users";
import { Warehouse } from "./Warehouse";
import { GoodsIssueItem } from "./GoodsIssueItem";
import { InventoryAdjustmentReport } from "./InventoryAdjustmentReport";
export declare class GoodsIssue {
    goodsIssueId: string;
    goodsIssueCode: string | null;
    description: string;
    issueType: string;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    status: string;
    active: boolean;
    notes: string | null;
    createdByUser: Users;
    lastUpdatedByUser: Users;
    warehouse: Warehouse;
    goodsIssueItems: GoodsIssueItem[];
    inventoryAdjustmentReports: InventoryAdjustmentReport[];
}
