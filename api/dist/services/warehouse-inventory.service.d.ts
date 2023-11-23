import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Repository } from "typeorm";
export declare class WarehouseInventoryService {
    private readonly itemBranchRepo;
    constructor(itemBranchRepo: Repository<ItemWarehouse>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ItemWarehouse[];
        total: number;
    }>;
}
