import { Item } from "./Item";
export declare class ItemCategory {
    itemCategoryId: string;
    name: string;
    description: string;
    active: boolean;
    itemCategoryCode: string | null;
    items: Item[];
}
