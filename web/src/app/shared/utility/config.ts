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
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      itemCategory: {
        getByAdvanceSearch: string;
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      item: {
        getByAdvanceSearch: string;
        getById: string;
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
      dashboard: {};
      message: { create: string };
    };
  }
