import { CreateGoodsIssueDto } from "src/core/dto/goods-issue/goods-issue.create.dto";
import { UpdateGoodsIssueDto, UpdateGoodsIssueStatusDto } from "src/core/dto/goods-issue/goods-issue.update.dto";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { Repository } from "typeorm";
export declare class GoodsIssueService {
    private readonly goodsIssueRepo;
    constructor(goodsIssueRepo: Repository<GoodsIssue>);
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
}
