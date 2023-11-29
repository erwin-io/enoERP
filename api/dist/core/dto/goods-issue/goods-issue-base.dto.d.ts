export declare class GoodsIssueItemDto {
    itemId: string;
    quantity: number;
}
export declare class DefaultGoodsIssueDto {
    description: string;
    goodsIssueItems: GoodsIssueItemDto[];
    issueType: "PENDING" | "DAMAGE" | "DISCREPANCY";
}
