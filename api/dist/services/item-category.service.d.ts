import { CreateItemCategoryDto } from "src/core/dto/item-category/item-category.create.dto";
import { UpdateItemCategoryDto } from "src/core/dto/item-category/item-category.update.dto";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { Repository } from "typeorm";
export declare class ItemCategoryService {
    private readonly itemCategoryRepo;
    constructor(itemCategoryRepo: Repository<ItemCategory>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ItemCategory[];
        total: number;
    }>;
    getByCode(itemCategoryCode: any): Promise<ItemCategory>;
    create(dto: CreateItemCategoryDto): Promise<ItemCategory>;
    update(itemCategoryCode: any, dto: UpdateItemCategoryDto): Promise<ItemCategory>;
    delete(itemCategoryCode: any): Promise<ItemCategory>;
}
