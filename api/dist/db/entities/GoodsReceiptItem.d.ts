import { GoodsReceipt } from "./GoodsReceipt";
import { Item } from "./Item";
export declare class GoodsReceiptItem {
    goodsReceiptId: string;
    itemId: string;
    quantity: string;
    goodsReceipt: GoodsReceipt;
    item: Item;
}
