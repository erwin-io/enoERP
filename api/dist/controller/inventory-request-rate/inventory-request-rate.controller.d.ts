import { CreateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.create.dto";
import { UpdateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { InventoryRequestRateService } from "src/services/inventory-request-rate.service";
export declare class InventoryRequestRateController {
    private readonly inventoryRequestRateService;
    constructor(inventoryRequestRateService: InventoryRequestRateService);
    getDetails(inventoryRequestRateCode: string): Promise<ApiResponseModel<InventoryRequestRate>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: InventoryRequestRate[];
        total: number;
    }>>;
    create(inventoryRequestRateDto: CreateInventoryRequestRateDto): Promise<ApiResponseModel<InventoryRequestRate>>;
    update(inventoryRequestRateCode: string, dto: UpdateInventoryRequestRateDto): Promise<ApiResponseModel<InventoryRequestRate>>;
    delete(inventoryRequestRateCode: string): Promise<ApiResponseModel<InventoryRequestRate>>;
}
