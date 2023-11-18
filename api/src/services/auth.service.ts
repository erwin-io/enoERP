/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtPayload } from "../core/interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import {
  compare,
  generateIndentityCode,
  getFullName,
  hash,
} from "src/common/utils/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import moment from "moment";
import { Users } from "src/db/entities/Users";
import { LOGIN_ERROR_PASSWORD_INCORRECT, LOGIN_ERROR_PENDING_ACCESS_REQUEST, LOGIN_ERROR_USER_NOT_FOUND } from "src/common/constant/auth-error.constant";
import { RegisterUserDto } from "src/core/dto/auth/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      let user = new Users();
      user.userName = dto.userName;
      user.password = await hash(dto.password);
      user.accessGranted = false;
      user.fullName = dto.fullName;
      user.mobileNumber = dto.mobileNumber;
      user.email = dto.email;
      user.birthDate = moment(dto.birthDate.toString()).format("YYYY-MM-DD");
      user.gender = dto.gender;
      return await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          user = await transactionalEntityManager.save(user);
          user.userCode = generateIndentityCode(user.userId);
          return await transactionalEntityManager.save(Users, user);
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async getByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
        },
        relations: {
          access: true,
          branch: true
        }
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;

      return user;
    } catch(ex) {
      throw ex;
    }
  }
}
