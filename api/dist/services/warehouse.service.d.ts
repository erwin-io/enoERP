import { CreateWarehouseDto } from "src/core/dto/warehouse/warehouse.create.dto";
import { UpdateWarehouseDto } from "src/core/dto/warehouse/warehouse.update.dto";
import { Warehouse } from "src/db/entities/Warehouse";
import { Repository } from "typeorm";
export declare class WarehouseService {
    private readonly warehouseRepo;
    constructor(warehouseRepo: Repository<Warehouse>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Warehouse[];
        total: number;
    }>;
    getById(warehouseId: any): Promise<Warehouse>;
    create(dto: CreateWarehouseDto): Promise<Warehouse>;
    update(warehouseId: any, dto: UpdateWarehouseDto): Promise<Warehouse>;
    delete(warehouseId: any): Promise<Warehouse>;
}
