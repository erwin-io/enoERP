import { CreateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.create.dto";
import { UpdateInventoryRequestDto, UpdateInventoryRequestStatusDto } from "src/core/dto/inventory-request/inventory-request.update.dto";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { Repository } from "typeorm";
export declare class InventoryRequestService {
    private readonly inventoryRequestRepo;
    constructor(inventoryRequestRepo: Repository<InventoryRequest>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: InventoryRequest[];
        total: number;
    }>;
    getByCode(inventoryRequestCode: any): Promise<InventoryRequest>;
    create(dto: CreateInventoryRequestDto): Promise<InventoryRequest>;
    update(inventoryRequestCode: any, dto: UpdateInventoryRequestDto): Promise<InventoryRequest>;
    updateStatus(inventoryRequestCode: any, dto: UpdateInventoryRequestStatusDto): Promise<InventoryRequest>;
}
