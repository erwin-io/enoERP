import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import { UpdateGoodsReceiptDto, UpdateGoodsReceiptStatusDto } from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { ChatGateway } from "src/core/gateway/chat.gateway";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
export declare class GoodsReceiptService {
    private readonly goodsReceiptRepo;
    private chatGateway;
    constructor(goodsReceiptRepo: Repository<GoodsReceipt>, chatGateway: ChatGateway);
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
    logNotification(users: Users[], goodsReceipt: GoodsReceipt, entityManager: EntityManager, title: string, description: string): Promise<void>;
    syncRealTime(goodsReceipt: GoodsReceipt): Promise<void>;
}
