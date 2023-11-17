import { Access } from "./Access";
export declare class Users {
    userId: string;
    userName: string;
    password: string;
    fullName: string;
    gender: string;
    birthDate: string;
    mobileNumber: string;
    email: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string | null;
    address: string;
    access: Access;
}
