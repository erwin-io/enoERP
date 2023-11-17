import { CreateWarehouseDto } from "src/core/dto/warehouse/warehouse.create.dto";
import { UpdateWarehouseDto } from "src/core/dto/warehouse/warehouse.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Warehouse } from "src/db/entities/Warehouse";
import { WarehouseService } from "src/services/warehouse.service";
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    getDetails(warehouseId: string): Promise<ApiResponseModel<Warehouse>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Warehouse[];
        total: number;
    }>>;
    create(warehouseDto: CreateWarehouseDto): Promise<ApiResponseModel<Warehouse>>;
    update(warehouseId: string, dto: UpdateWarehouseDto): Promise<ApiResponseModel<Warehouse>>;
    delete(warehouseId: string): Promise<ApiResponseModel<Warehouse>>;
}
