import { CreateSalesInvoiceDto } from "src/core/dto/sales-invoice/sales-invoice.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SalesInvoice } from "src/db/entities/SalesInvoice";
import { SalesInvoiceService } from "src/services/sales-invoice.service";
export declare class SalesInvoiceController {
    private readonly salesInvoiceService;
    constructor(salesInvoiceService: SalesInvoiceService);
    getDetails(salesInvoiceCode: string): Promise<ApiResponseModel<SalesInvoice>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: SalesInvoice[];
        total: number;
    }>>;
    create(salesInvoiceDto: CreateSalesInvoiceDto): Promise<ApiResponseModel<SalesInvoice>>;
    void(salesInvoiceCode: string): Promise<ApiResponseModel<SalesInvoice>>;
}
