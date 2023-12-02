export declare class SalesInvoiceItemDto {
    itemId: string;
    quantity: number;
    unitPrice: 0;
}
export declare class SalesInvoicePaymentDto {
    paymentType: "CASH" | "CREDIT CARD" | "DEBIT CARD" | "MOBILE PAYMENT" | "CHECK";
    amount: number;
}
export declare class DefaultSalesInvoiceDto {
    createdByUserId: string;
    branchId: string;
    salesInvoiceItems: SalesInvoiceItemDto[];
    salesInvoicePayments: SalesInvoicePaymentDto[];
}
