export declare class InventoryRequestItemDto {
    itemId: string;
    quantity: number;
}
export declare class DefaultInventoryRequestDto {
    description: string;
    inventoryRequestItems: InventoryRequestItemDto[];
}
