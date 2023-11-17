import { CreateItemCategoryDto } from "src/core/dto/item-category/item-category.create.dto";
import { UpdateItemCategoryDto } from "src/core/dto/item-category/item-category.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { ItemCategoryService } from "src/services/item-category.service";
export declare class ItemCategoryController {
    private readonly itemCategoryService;
    constructor(itemCategoryService: ItemCategoryService);
    getDetails(itemCategoryId: string): Promise<ApiResponseModel<ItemCategory>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: ItemCategory[];
        total: number;
    }>>;
    create(itemCategoryDto: CreateItemCategoryDto): Promise<ApiResponseModel<ItemCategory>>;
    update(itemCategoryId: string, dto: UpdateItemCategoryDto): Promise<ApiResponseModel<ItemCategory>>;
    delete(itemCategoryId: string): Promise<ApiResponseModel<ItemCategory>>;
}
