import { GoodsIssueItem } from "./GoodsIssueItem";
import { GoodsReceiptItem } from "./GoodsReceiptItem";
import { InventoryAdjustmentReportItem } from "./InventoryAdjustmentReportItem";
import { InventoryRequestItem } from "./InventoryRequestItem";
import { InventoryRequestRate } from "./InventoryRequestRate";
import { ItemCategory } from "./ItemCategory";
import { ItemBranch } from "./ItemBranch";
import { ItemWarehouse } from "./ItemWarehouse";
import { SalesInvoiceItem } from "./SalesInvoiceItem";
export declare class Item {
    itemId: string;
    itemCode: string;
    itemName: string;
    itemDescription: string;
    price: string;
    dateAdded: string;
    dateLastUpdated: string | null;
    active: boolean;
    goodsIssueItems: GoodsIssueItem[];
    goodsReceiptItems: GoodsReceiptItem[];
    inventoryAdjustmentReportItems: InventoryAdjustmentReportItem[];
    inventoryRequestItems: InventoryRequestItem[];
    inventoryRequestRates: InventoryRequestRate[];
    itemCategory: ItemCategory;
    itemBranches: ItemBranch[];
    itemWarehouses: ItemWarehouse[];
    salesInvoiceItems: SalesInvoiceItem[];
}
