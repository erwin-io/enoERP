import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { InventoryMasterlistService } from "src/services/inventory-masterlist.service";
export declare class InventoryMasterlistController {
    private readonly inventoryMasterlistService;
    constructor(inventoryMasterlistService: InventoryMasterlistService);
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: ItemBranch[];
        total: number;
    }>>;
    getByItemCode(branchCode: string, itemCode: string): Promise<ApiResponseModel<ItemBranch>>;
}
