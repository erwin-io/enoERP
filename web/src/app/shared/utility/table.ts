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
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number" | "number-range";
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
