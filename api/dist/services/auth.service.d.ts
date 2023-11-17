import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Users } from "src/db/entities/Users";
import { RegisterUserDto } from "src/core/dto/auth/register.dto";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<Users>, jwtService: JwtService);
    register(dto: RegisterUserDto): Promise<Users>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
}
