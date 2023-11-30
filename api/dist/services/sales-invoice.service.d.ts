import { CreateSalesInvoiceDto } from "src/core/dto/sales-invoice/sales-invoice.create.dto";
import { SalesInvoice } from "src/db/entities/SalesInvoice";
import { Repository } from "typeorm";
export declare class SalesInvoiceService {
    private readonly salesInvoiceRepo;
    constructor(salesInvoiceRepo: Repository<SalesInvoice>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: SalesInvoice[];
        total: number;
    }>;
    getByCode(salesInvoiceCode: any): Promise<SalesInvoice>;
    create(dto: CreateSalesInvoiceDto): Promise<SalesInvoice>;
    void(salesInvoiceCode: any): Promise<SalesInvoice>;
}
