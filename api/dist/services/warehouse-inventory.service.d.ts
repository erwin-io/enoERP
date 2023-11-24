import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Repository } from "typeorm";
export declare class WarehouseInventoryService {
    private readonly itemWarehouse;
    constructor(itemWarehouse: Repository<ItemWarehouse>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ItemWarehouse[];
        total: number;
    }>;
    getByItemCode(warehouseCode: string, itemCode: string): Promise<ItemWarehouse>;
}
