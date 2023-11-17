import { CreateBranchDto } from "src/core/dto/branch/branch.create.dto";
import { UpdateBranchDto } from "src/core/dto/branch/branch.update.dto";
import { Branch } from "src/db/entities/Branch";
import { Repository } from "typeorm";
export declare class BranchService {
    private readonly branchRepo;
    constructor(branchRepo: Repository<Branch>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Branch[];
        total: number;
    }>;
    getById(branchId: any): Promise<Branch>;
    create(dto: CreateBranchDto): Promise<Branch>;
    update(branchId: any, dto: UpdateBranchDto): Promise<Branch>;
    delete(branchId: any): Promise<Branch>;
}
