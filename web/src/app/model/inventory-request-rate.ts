import { InventoryRequestItem } from './inventory-request';
import { Item } from './item';
export class InventoryRequestRate {
  inventoryRequestRateId: string;
  inventoryRequestRateCode: string;
  rate: string;
  rateName: string;
  minQuantity: string;
  maxQuantity: string;
  active: boolean;
  inventoryRequestItems: InventoryRequestItem[];
  items: Item[];
  item: Item;
  baseRate: boolean;
}
