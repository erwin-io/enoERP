import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import { UpdateGoodsReceiptDto, UpdateGoodsReceiptStatusDto } from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { Repository } from "typeorm";
export declare class GoodsReceiptService {
    private readonly goodsReceiptRepo;
    constructor(goodsReceiptRepo: Repository<GoodsReceipt>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: GoodsReceipt[];
        total: number;
    }>;
    getByCode(goodsReceiptCode: any): Promise<GoodsReceipt>;
    create(dto: CreateGoodsReceiptDto): Promise<GoodsReceipt>;
    update(goodsReceiptCode: any, dto: UpdateGoodsReceiptDto): Promise<GoodsReceipt>;
    updateStatus(goodsReceiptCode: any, dto: UpdateGoodsReceiptStatusDto): Promise<GoodsReceipt>;
}
