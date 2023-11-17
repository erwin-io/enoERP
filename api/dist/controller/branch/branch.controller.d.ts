import { CreateBranchDto } from "src/core/dto/branch/branch.create.dto";
import { UpdateBranchDto } from "src/core/dto/branch/branch.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Branch } from "src/db/entities/Branch";
import { BranchService } from "src/services/branch.service";
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: BranchService);
    getDetails(branchId: string): Promise<ApiResponseModel<Branch>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Branch[];
        total: number;
    }>>;
    create(branchDto: CreateBranchDto): Promise<ApiResponseModel<Branch>>;
    update(branchId: string, dto: UpdateBranchDto): Promise<ApiResponseModel<Branch>>;
    delete(branchId: string): Promise<ApiResponseModel<Branch>>;
}
