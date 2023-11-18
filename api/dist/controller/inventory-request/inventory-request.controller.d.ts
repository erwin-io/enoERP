import { CreateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.create.dto";
import { UpdateInventoryRequestDto, UpdateInventoryRequestStatusDto } from "src/core/dto/inventory-request/inventory-request.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestService } from "src/services/inventory-request.service";
export declare class InventoryRequestController {
    private readonly inventoryRequestService;
    constructor(inventoryRequestService: InventoryRequestService);
    getDetails(inventoryRequestCode: string): Promise<ApiResponseModel<InventoryRequest>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: InventoryRequest[];
        total: number;
    }>>;
    create(inventoryRequestDto: CreateInventoryRequestDto): Promise<ApiResponseModel<InventoryRequest>>;
    update(inventoryRequestCode: string, dto: UpdateInventoryRequestDto): Promise<ApiResponseModel<InventoryRequest>>;
    updateStatus(inventoryRequestCode: string, dto: UpdateInventoryRequestStatusDto): Promise<ApiResponseModel<InventoryRequest>>;
}
