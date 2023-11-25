import { CreateSupplierDto } from "src/core/dto/supplier/supplier.create.dto";
import { UpdateSupplierDto } from "src/core/dto/supplier/supplier.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Supplier } from "src/db/entities/Supplier";
import { SupplierService } from "src/services/supplier.service";
export declare class SupplierController {
    private readonly supplierService;
    constructor(supplierService: SupplierService);
    getDetails(supplierCode: string): Promise<ApiResponseModel<Supplier>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Supplier[];
        total: number;
    }>>;
    create(supplierDto: CreateSupplierDto): Promise<ApiResponseModel<Supplier>>;
    update(supplierCode: string, dto: UpdateSupplierDto): Promise<ApiResponseModel<Supplier>>;
    delete(supplierCode: string): Promise<ApiResponseModel<Supplier>>;
}
