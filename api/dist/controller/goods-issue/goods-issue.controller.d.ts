import { CreateGoodsIssueDto } from "src/core/dto/goods-issue/goods-issue.create.dto";
import { UpdateGoodsIssueDto, UpdateGoodsIssueStatusDto } from "src/core/dto/goods-issue/goods-issue.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueService } from "src/services/goods-issue.service";
export declare class GoodsIssueController {
    private readonly goodsIssueService;
    constructor(goodsIssueService: GoodsIssueService);
    getDetails(goodsIssueCode: string): Promise<ApiResponseModel<GoodsIssue>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: GoodsIssue[];
        total: number;
    }>>;
    create(goodsIssueDto: CreateGoodsIssueDto): Promise<ApiResponseModel<GoodsIssue>>;
    update(goodsIssueCode: string, dto: UpdateGoodsIssueDto): Promise<ApiResponseModel<GoodsIssue>>;
    updateStatus(goodsIssueCode: string, dto: UpdateGoodsIssueStatusDto): Promise<ApiResponseModel<GoodsIssue>>;
}
