import { GoodsReceipt } from './goods-receipt';
import { Item } from './item';
export class Supplier {
  supplierId: string;
  supplierCode: string;
  name: string;
  active: boolean;
  goodsReceipts: GoodsReceipt[];
}
