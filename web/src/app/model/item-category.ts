import { Item } from './item';
export class ItemCategory {
  itemCategoryId: string;
  name: string;
  description: string;
  active: boolean;
  items: Item[];
}
