import { Users } from "./Users";
import { Warehouse } from "./Warehouse";
import { GoodsReceiptItem } from "./GoodsReceiptItem";
export declare class GoodsReceipt {
    goodsReceiptId: string;
    goodsReceiptCode: string;
    description: string;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    status: string;
    active: boolean;
    createdByUser: Users;
    warehouse: Warehouse;
    goodsReceiptItems: GoodsReceiptItem[];
}
