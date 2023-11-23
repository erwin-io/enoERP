import { CreateItemDto } from "src/core/dto/item/item.create.dto";
import { UpdateItemDto } from "src/core/dto/item/item.update.dto";
import { Item } from "src/db/entities/Item";
import { Repository } from "typeorm";
export declare class ItemService {
    private readonly itemRepo;
    constructor(itemRepo: Repository<Item>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Item[];
        total: number;
    }>;
    getById(itemId: any): Promise<Item>;
    getByCode(itemCode?: string): Promise<Item>;
    create(dto: CreateItemDto): Promise<Item>;
    update(itemId: any, dto: UpdateItemDto): Promise<Item>;
    delete(itemId: any): Promise<Item>;
}
