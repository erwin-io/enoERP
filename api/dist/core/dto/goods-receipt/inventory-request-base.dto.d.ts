export declare class InventoryRequestItemDto {
    itemId: string;
    quantity: number;
    inventoryRequestRateCode: string;
}
export declare class DefaultInventoryRequestDto {
    description: string;
    inventoryRequestItems: InventoryRequestItemDto[];
}
