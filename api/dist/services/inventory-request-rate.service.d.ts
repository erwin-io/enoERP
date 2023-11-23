import { CreateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.create.dto";
import { UpdateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.update.dto";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { Repository } from "typeorm";
export declare class InventoryRequestRateService {
    private readonly inventoryRequestRateRepo;
    constructor(inventoryRequestRateRepo: Repository<InventoryRequestRate>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: InventoryRequestRate[];
        total: number;
    }>;
    getByCode(inventoryRequestRateCode: any): Promise<InventoryRequestRate>;
    create(dto: CreateInventoryRequestRateDto): Promise<InventoryRequestRate>;
    update(inventoryRequestRateCode: any, dto: UpdateInventoryRequestRateDto): Promise<InventoryRequestRate>;
    delete(inventoryRequestRateCode: any): Promise<InventoryRequestRate>;
}
