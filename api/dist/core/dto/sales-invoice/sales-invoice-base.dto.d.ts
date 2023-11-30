export declare class SalesInvoiceItemDto {
    itemId: string;
    quantity: number;
    unitPrice: 0;
}
export declare class DefaultSalesInvoiceDto {
    createdByUserId: string;
    branchId: string;
    salesInvoiceItems: SalesInvoiceItemDto[];
}
