import { CreateItemDto } from "src/core/dto/item/item.create.dto";
import { UpdateItemDto } from "src/core/dto/item/item.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Item } from "src/db/entities/Item";
import { ItemService } from "src/services/item.service";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    getDetails(itemId: string): Promise<ApiResponseModel<Item>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Item[];
        total: number;
    }>>;
    create(itemDto: CreateItemDto): Promise<ApiResponseModel<Item>>;
    update(itemId: string, dto: UpdateItemDto): Promise<ApiResponseModel<Item>>;
    delete(itemId: string): Promise<ApiResponseModel<Item>>;
}
