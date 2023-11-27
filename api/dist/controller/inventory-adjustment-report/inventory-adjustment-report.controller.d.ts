import { CreateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.create.dto";
import { CloseInventoryAdjustmentReportStatusDto, ProcessInventoryAdjustmentReportStatusDto, UpdateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryAdjustmentReport } from "src/db/entities/InventoryAdjustmentReport";
import { InventoryAdjustmentReportService } from "src/services/inventory-adjustment-report.service";
export declare class InventoryAdjustmentReportController {
    private readonly inventoryAdjustmentReportService;
    constructor(inventoryAdjustmentReportService: InventoryAdjustmentReportService);
    getDetails(inventoryAdjustmentReportCode: string): Promise<ApiResponseModel<InventoryAdjustmentReport>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: InventoryAdjustmentReport[];
        total: number;
    }>>;
    create(inventoryAdjustmentReportDto: CreateInventoryAdjustmentReportDto): Promise<ApiResponseModel<InventoryAdjustmentReport>>;
    update(inventoryAdjustmentReportCode: string, dto: UpdateInventoryAdjustmentReportDto): Promise<ApiResponseModel<InventoryAdjustmentReport>>;
    processStatus(inventoryAdjustmentReportCode: string, dto: ProcessInventoryAdjustmentReportStatusDto): Promise<ApiResponseModel<InventoryAdjustmentReport>>;
    closeReport(inventoryAdjustmentReportCode: string, dto: CloseInventoryAdjustmentReportStatusDto): Promise<ApiResponseModel<InventoryAdjustmentReport>>;
}
