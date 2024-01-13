import { CreateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.create.dto";
import { CloseInventoryRequestStatusDto, ProcessInventoryRequestStatusDto, UpdateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.update.dto";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
export declare class InventoryRequestService {
    private readonly inventoryRequestRepo;
    private pusherService;
    constructor(inventoryRequestRepo: Repository<InventoryRequest>, pusherService: PusherService);
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
    updateStatus(inventoryRequestCode: any, dto: ProcessInventoryRequestStatusDto | CloseInventoryRequestStatusDto): Promise<InventoryRequest>;
    logNotification(users: Users[], inventoryRequest: InventoryRequest, entityManager: EntityManager, title: string, description: string): Promise<void>;
    syncRealTime(inventoryRequest: InventoryRequest): Promise<void>;
}
