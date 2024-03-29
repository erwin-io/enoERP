import { AccessPages } from "src/app/model/access";
import { ColumnDefinition } from "./table"

export interface AppConfig {
    appName: string;
    reservationConfig: {
      maxCancellation: string;
      daysCancellationLimitReset: string;
      timeSlotHours: {
        start: string;
        end: string;
      };
      timeSlotNotAvailableHours: string[];
      dayOfWeekNotAvailable: string[];
    };
    tableColumns: {
      users: ColumnDefinition[];
      access: ColumnDefinition[];
      itemCategory: ColumnDefinition[];
      item: ColumnDefinition[];
      warehouse: ColumnDefinition[];
      branch: ColumnDefinition[];
      inventoryMasterlist: ColumnDefinition[];
      inventoryRequest: ColumnDefinition[];
      inventoryAdjustmentReport: ColumnDefinition[];
      adjustmentConfirmation: ColumnDefinition[];
      incomingInventoryRequest: ColumnDefinition[];
      inventoryRequestRate: ColumnDefinition[];
      warehouseInventory: ColumnDefinition[];
      goodsReceipt: ColumnDefinition[];
      goodsIssue: ColumnDefinition[];
      salesInvoice: ColumnDefinition[];
      supplier: ColumnDefinition[];
    };
    sessionConfig: {
      sessionTimeout: string;
    };
    lookup: {
      accessPages: AccessPages[];
    };
    apiEndPoints: {
      auth: {
        login: string,
        register: string;
      };
      user: {
        getByCode: string;
        createUsers: string;
        updateProfile: string;
        updateUsers: string;
        getUsersByAdvanceSearch: string;
        resetUserPassword: string;
        approveAccessRequest: string;
      };
      access: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      itemCategory: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      item: {
        getByAdvanceSearch: string;
        getById: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      warehouse: {
        getByAdvanceSearch: string;
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      branch: {
        getByAdvanceSearch: string;
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      supplier: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      inventoryMasterlist: {
        getByAdvanceSearch: string;
        getByItemCode: string;
      };
      warehouseInventory: {
        getByAdvanceSearch: string;
        getByItemCode: string;
      };
      inventoryRequest: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        processStatus: string;
        closeRequest: string;
      },
      inventoryAdjustmentReport: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        processStatus: string;
        closeReport: string;
      },
      inventoryRequestRate: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      },
      goodsReceipt: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        updateStatus: string;
      }
      goodsIssue: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        updateStatus: string;
      };
      salesInvoice: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        void: string;
      };
      notifications: {
        getByAdvanceSearch: string;
        getUnreadByUser: string;
        marAsRead: string;
      };
      dashboard: {};
      message: { create: string };
    };
  }
