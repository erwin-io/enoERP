import { LocalAuthGuard } from "../../core/auth/local.auth.guard";
import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Headers,
  Query,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { REGISTER_SUCCESS } from "src/common/constant/api-response.constant";
import { RegisterUserDto } from "src/core/dto/auth/register.dto";
import { Users } from "src/db/entities/Users";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public async register(@Body() createUserDto: RegisterUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.register(createUserDto);
      res.success = true;
      res.message = `Member ${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login")
  public async loginAdmin(@Body() loginUserDto: LogInDto) {
    const res: ApiResponseModel<Users> = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.authService.getByCredentials(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
