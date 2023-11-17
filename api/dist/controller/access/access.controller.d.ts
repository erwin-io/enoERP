import { CreateAccessDto } from "src/core/dto/access/access.create.dto";
import { UpdateAccessDto } from "src/core/dto/access/access.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Access } from "src/db/entities/Access";
import { AccessService } from "src/services/access.service";
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    getDetails(accessId: string): Promise<ApiResponseModel<Access>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Access[];
        total: number;
    }>>;
    create(accessDto: CreateAccessDto): Promise<ApiResponseModel<Access>>;
    update(accessId: string, dto: UpdateAccessDto): Promise<ApiResponseModel<Access>>;
    delete(accessId: string): Promise<ApiResponseModel<Access>>;
}
