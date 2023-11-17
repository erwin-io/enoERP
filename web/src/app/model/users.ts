import { Access } from "./access";
import { Branch } from "./branch";
import { Files } from "./files";

export class Users {
    userId: string;
    userName: string;
    fullName: string;
    gender: string;
    birthDate: string;
    mobileNumber: string;
    email: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string;
    address: string;
    access: Access;
    branch: Branch;
  }
