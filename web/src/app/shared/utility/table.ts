export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  format?: {
    type: "currency" | "date" | "date-time" | "number" | "custom";
    custom: string;
  };
  hide?: boolean;
  type?: "string" | "boolean" | "date" | "number" = "string";
  filterOptions: ColumnDefinitionFilterOptions;
  urlPropertyName?: string;
  filter: any;
}

export class ColumnDefinitionFilterOptions {
  placeholder?: string;
  enable?: boolean;
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number" | "number-range" | "precise";
};
export class ColumnStyle {
  width: string;
  left: string;
}


export class UsersTableColumn {
  userName: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  branch: string;
  enable: boolean;
  url?: string;
}


export class AccessTableColumn {
  accessId: string;
  accessCode: string;
  name?: string;
  url?: string;
}

export class ItemCategoryTableColumn {
  itemCategoryId: string;
  name?: string;
  url?: string;
}

export class ItemTableColumn {
  itemCode: string;
  itemName?: string;
  itemDescription?: string;
  price?: string;
  itemCategory?: string;
  url?: string;
}

export class WarehouseTableColumn {
  warehouseId?: string;
  warehouseCode?: string;
  name?: string;
  url?: string;
}

export class BranchTableColumn {
  branchId?: string;
  branchCode?: string;
  name?: string;
  isMainBranch?: boolean;
  url?: string;
}

export class InventoryMasterlistTableColumn {
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  itemDescription?: string;
  price?: string;
  itemCategory?: string;
  branch?: string;
  quantity?: string;
}

export class WarehouseInventoryTableColumn {
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  quantity?: string;
  orderedQuantity?: string;
  warehouse: string
}

export class InventoryRequestTableColumn {
  inventoryRequestId?: string;
  inventoryRequestCode?: string;
  dateRequested?: string;
  fromWarehouse?: string;
  requestedByUser?: string;
  url?: string;
}

export class InventoryRequestItemTableColumn {
  quantity: string;
  quantityReceived: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  itemCategory: string;
  inventoryRequestRateCode: string;
  rate: string;
  totalAmount: number;
}

export class InventoryAdjustmentReportTableColumn {
  inventoryAdjustmentReportId?: string;
  inventoryAdjustmentReportCode?: string;
  dateReported?: string;
  reportedByUser?: string;
  reportType?: string;
  url?: string;
}

export class InventoryAdjustmentReportItemTableColumn {
  returnedQuantity?: string;
  totalRefund?: number;
  proposedUnitReturnRate?: number;
  quantityReceived?: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  isEditMode?: boolean;
  isInvalidReturnedQuantity?: boolean;
  isReturnedQuantityChanged?: boolean;
}

export class AdjustmentConfirmationTableColumn {
  inventoryAdjustmentReportId?: string;
  inventoryAdjustmentReportCode?: string;
  branch?: string;
  dateReported?: string;
  reportedByUser?: string;
  reportType?: string;
  url?: string;
}

export class AdjustmentConfirmationItemTableColumn {
  returnedQuantity?: string;
  totalRefund?: number;
  proposedUnitReturnRate?: number;
  quantityReceived?: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  isEditMode?: boolean;
  isInvalidProposedUnitReturnRate?: boolean;
  isProposedUnitReturnRateChanged?: boolean;
}

export class IncomingInventoryRequestTableColumn {
  inventoryRequestId?: string;
  inventoryRequestCode?: string;
  dateRequested?: string;
  branch?: string;
  fromWarehouse?: string;
  requestedByUser?: string;
  url?: string;
}

export class InventoryRequestRateTableColumn {
  inventoryRequestRateId?: string;
  rate?: string;
  rateName?: string;
  minQuantity?: string;
  maxQuantity?: string;
  itemName?: string;
  url?: string;
}


export class GoodsReceiptTableColumn {
  goodsReceiptId?: string;
  goodsReceiptCode?: string;
  dateCreated?: string;
  warehouse?: string;
  supplier?: string;
  createdByUser?: string;
  url?: string;
}

export class GoodsReceiptItemTableColumn {
  quantity: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  itemCategory: string;
}

export class GoodsIssueTableColumn {
  goodsReceiptId?: string;
  goodsReceiptCode?: string;
  dateCreated?: string;
  warehouse?: string;
  issueType?: string;
  createdByUser?: string;
  url?: string;
}

export class GoodsIssueItemTableColumn {
  quantity: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  itemCategory: string;
}

export class SalesInvoiceTableColumn {
  salesInvoiceId?: string;
  salesInvoiceCode?: string;
  salesDate?: string;
  createdByUser?: string;
  url?: string;
}

export class SalesInvoiceItemTableColumn {
  quantity: string;
  unitPrice: string;
  amount: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  itemCategory: string;
}

export class SalesInvoicePaymentsTableColumn {
  paymentType?: string;
  isInvalidPaymentType?: boolean;
  isPaymentTypeChanged?: boolean;
  amount?: number;
  isInvalidAmount?: boolean;
  isAmountChanged?: boolean;
  isEditMode?: boolean;
}

export class SupplierTableColumn {
  supplierId?: string;
  supplierCode?: string;
  name?: string;
  url?: string;
}


