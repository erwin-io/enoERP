import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import { UpdateGoodsReceiptDto, UpdateGoodsReceiptStatusDto } from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptService } from "src/services/goods-receipt.service";
export declare class GoodsReceiptController {
    private readonly goodsReceiptService;
    constructor(goodsReceiptService: GoodsReceiptService);
    getDetails(goodsReceiptCode: string): Promise<ApiResponseModel<GoodsReceipt>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: GoodsReceipt[];
        total: number;
    }>>;
    create(goodsReceiptDto: CreateGoodsReceiptDto): Promise<ApiResponseModel<GoodsReceipt>>;
    update(goodsReceiptCode: string, dto: UpdateGoodsReceiptDto): Promise<ApiResponseModel<GoodsReceipt>>;
    updateStatus(goodsReceiptCode: string, dto: UpdateGoodsReceiptStatusDto): Promise<ApiResponseModel<GoodsReceipt>>;
}
