import { GoodsIssue } from "./GoodsIssue";
import { GoodsReceipt } from "./GoodsReceipt";
import { InventoryRequest } from "./InventoryRequest";
import { ItemWarehouse } from "./ItemWarehouse";
export declare class Warehouse {
    warehouseId: string;
    warehouseCode: string;
    name: string;
    active: boolean;
    goodsIssues: GoodsIssue[];
    goodsReceipts: GoodsReceipt[];
    inventoryRequests: InventoryRequest[];
    itemWarehouses: ItemWarehouse[];
}
