import { Users } from "./Users";
import { Supplier } from "./Supplier";
import { Warehouse } from "./Warehouse";
import { GoodsReceiptItem } from "./GoodsReceiptItem";
export declare class GoodsReceipt {
    goodsReceiptId: string;
    goodsReceiptCode: string | null;
    description: string;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    status: string;
    active: boolean;
    notes: string | null;
    createdByUser: Users;
    lastUpdatedByUser: Users;
    supplier: Supplier;
    warehouse: Warehouse;
    goodsReceiptItems: GoodsReceiptItem[];
}
