import { DefaultUserDto } from "./user-base.dto";
export declare class CreateUserDto extends DefaultUserDto {
    userName: string;
    password: string;
    accessId: string;
    branchId: string;
}
