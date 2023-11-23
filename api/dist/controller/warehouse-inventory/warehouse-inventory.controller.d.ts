import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { WarehouseInventoryService } from "src/services/warehouse-inventory.service";
export declare class WarehouseInventoryController {
    private readonly warehouseInventoryService;
    constructor(warehouseInventoryService: WarehouseInventoryService);
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: ItemWarehouse[];
        total: number;
    }>>;
}
