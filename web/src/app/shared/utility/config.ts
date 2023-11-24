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
      incomingInventoryRequest: ColumnDefinition[];
      inventoryRequestRate: ColumnDefinition[];
      warehouseInventory: ColumnDefinition[];
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
      inventoryMasterlist: {
        getByAdvanceSearch: string;
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
        updateStatus: string;
      },
      inventoryRequestRate: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      dashboard: {};
      message: { create: string };
    };
  }
