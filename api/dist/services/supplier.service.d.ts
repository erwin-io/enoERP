import { CreateSupplierDto } from "src/core/dto/supplier/supplier.create.dto";
import { UpdateSupplierDto } from "src/core/dto/supplier/supplier.update.dto";
import { Supplier } from "src/db/entities/Supplier";
import { Repository } from "typeorm";
export declare class SupplierService {
    private readonly supplierRepo;
    constructor(supplierRepo: Repository<Supplier>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Supplier[];
        total: number;
    }>;
    getByCode(supplierCode: any): Promise<Supplier>;
    create(dto: CreateSupplierDto): Promise<Supplier>;
    update(supplierCode: any, dto: UpdateSupplierDto): Promise<Supplier>;
    delete(supplierCode: any): Promise<Supplier>;
}
