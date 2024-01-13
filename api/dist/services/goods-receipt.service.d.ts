import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import { UpdateGoodsReceiptDto, UpdateGoodsReceiptStatusDto } from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
export declare class GoodsReceiptService {
    private readonly goodsReceiptRepo;
    private pusherService;
    constructor(goodsReceiptRepo: Repository<GoodsReceipt>, pusherService: PusherService);
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
