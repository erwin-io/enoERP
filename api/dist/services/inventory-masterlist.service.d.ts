import { ItemBranch } from "src/db/entities/ItemBranch";
import { Repository } from "typeorm";
export declare class InventoryMasterlistService {
    private readonly itemBranchRepo;
    constructor(itemBranchRepo: Repository<ItemBranch>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ItemBranch[];
        total: number;
    }>;
}
