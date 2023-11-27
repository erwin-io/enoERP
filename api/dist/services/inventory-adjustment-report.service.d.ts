import { CreateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.create.dto";
import { CloseInventoryAdjustmentReportStatusDto, ProcessInventoryAdjustmentReportStatusDto, UpdateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.update.dto";
import { InventoryAdjustmentReport } from "src/db/entities/InventoryAdjustmentReport";
import { Repository } from "typeorm";
export declare class InventoryAdjustmentReportService {
    private readonly inventoryAdjustmentReportRepo;
    constructor(inventoryAdjustmentReportRepo: Repository<InventoryAdjustmentReport>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: InventoryAdjustmentReport[];
        total: number;
    }>;
    getByCode(inventoryAdjustmentReportCode: any): Promise<InventoryAdjustmentReport>;
    create(dto: CreateInventoryAdjustmentReportDto): Promise<InventoryAdjustmentReport>;
    update(inventoryAdjustmentReportCode: any, dto: UpdateInventoryAdjustmentReportDto): Promise<InventoryAdjustmentReport>;
    updateStatus(inventoryAdjustmentReportCode: any, dto: ProcessInventoryAdjustmentReportStatusDto | CloseInventoryAdjustmentReportStatusDto): Promise<InventoryAdjustmentReport>;
}
