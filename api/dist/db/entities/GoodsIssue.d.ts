import { Users } from "./Users";
import { Warehouse } from "./Warehouse";
import { GoodsIssueItem } from "./GoodsIssueItem";
export declare class GoodsIssue {
    goodsIssueId: string;
    goodsIssueCode: string;
    description: string;
    issueType: string;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    status: string;
    active: boolean;
    createdByUser: Users;
    warehouse: Warehouse;
    goodsIssueItems: GoodsIssueItem[];
}
