import { CreateGoodsIssueDto } from "src/core/dto/goods-issue/goods-issue.create.dto";
import { UpdateGoodsIssueDto, UpdateGoodsIssueStatusDto } from "src/core/dto/goods-issue/goods-issue.update.dto";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
export declare class GoodsIssueService {
    private readonly goodsIssueRepo;
    private pusherService;
    constructor(goodsIssueRepo: Repository<GoodsIssue>, pusherService: PusherService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: GoodsIssue[];
        total: number;
    }>;
    getByCode(goodsIssueCode: any): Promise<GoodsIssue>;
    create(dto: CreateGoodsIssueDto): Promise<GoodsIssue>;
    update(goodsIssueCode: any, dto: UpdateGoodsIssueDto): Promise<GoodsIssue>;
    updateStatus(goodsIssueCode: any, dto: UpdateGoodsIssueStatusDto): Promise<GoodsIssue>;
    logNotification(users: Users[], goodsIssue: GoodsIssue, entityManager: EntityManager, title: string, description: string): Promise<void>;
    syncRealTime(goodsIssue: GoodsIssue): Promise<void>;
}
