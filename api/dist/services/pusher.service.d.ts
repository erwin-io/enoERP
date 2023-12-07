import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
export declare class PusherService {
    trigger(channel: any, event: any, data: any): void;
    reSync(type: string, data: any): Promise<void>;
    inventoryRequestChanges(userIds: string[], inventoryRequest: InventoryRequest): Promise<void>;
    goodsIssueChanges(userIds: string[], goodsIssue: GoodsIssue): Promise<void>;
    goodsReceiptChanges(userIds: string[], goodsReceipt: GoodsReceipt): Promise<void>;
    sendNotif(userIds: string[], title: string, description: any): Promise<void>;
}
