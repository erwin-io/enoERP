import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { RegisterUserDto } from "src/core/dto/auth/register.dto";
import { Users } from "src/db/entities/Users";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: RegisterUserDto): Promise<ApiResponseModel<Users>>;
    loginAdmin(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
}
