import { CreateAccessDto } from "src/core/dto/access/access.create.dto";
import { UpdateAccessDto } from "src/core/dto/access/access.update.dto";
import { Access } from "src/db/entities/Access";
import { Repository } from "typeorm";
export declare class AccessService {
    private readonly accessRepo;
    constructor(accessRepo: Repository<Access>);
    getAccessPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Access[];
        total: number;
    }>;
    getById(accessId: any): Promise<Access>;
    create(dto: CreateAccessDto): Promise<Access>;
    update(accessId: any, dto: UpdateAccessDto): Promise<Access>;
    delete(accessId: any): Promise<Access>;
}
