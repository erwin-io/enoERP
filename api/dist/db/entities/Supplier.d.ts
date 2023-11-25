import { GoodsReceipt } from "./GoodsReceipt";
export declare class Supplier {
    supplierId: string;
    supplierCode: string | null;
    name: string;
    active: boolean;
    goodsReceipts: GoodsReceipt[];
}
