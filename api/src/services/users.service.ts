import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  hash,
} from "./../common/utils/utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { ACCESS_ERROR_NOT_FOUND } from "src/common/constant/access.constant";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { UpdateUserResetPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { CreateUserDto } from "src/core/dto/user/users.create.dto";
import { UpdateUserDto } from "src/core/dto/user/users.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Access } from "src/db/entities/Access";
import { Branch } from "src/db/entities/Branch";
import { Users } from "src/db/entities/Users";
import { Repository } from "typeorm";

const defaultUserSelect = {
  userId: true,
  userName: true,
  fullName: true,
  gender: true,
  birthDate: true,
  mobileNumber: true,
  email: true,
  address: true,
  accessGranted: true,
  active: true,
  userCode: true,
  branch: {
    branchId: true,
    branchCode: true,
    name: true,
  },
  access: {
    accessId: true,
    accessCode: true,
    name: true,
    accessPages: [],
    active: true,
  },
};

@Injectable()
export class UsersService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Users) private readonly userRepo: Repository<Users>
  ) {}

  async getUserPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.userRepo.find({
        select: defaultUserSelect as any,
        where: {
          ...condition,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
        skip,
        take,
        order,
      }),
      this.userRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getUserById(userId) {
    const res = await this.userRepo.findOne({
      select: defaultUserSelect as any,
      where: {
        userId,
        active: true,
      },
      relations: {
        access: true,
        branch: true,
      },
    });

    if (!res) {
      throw Error(USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    if (res.access && res?.access?.accessPages) {
      res.access.accessPages =
        res?.access && res?.access?.accessPages
          ? (
              res.access.accessPages as {
                page: string;
                view: boolean;
                modify: boolean;
                rights: string[];
              }[]
            ).map((res) => {
              if (!res.rights) {
                res["rights"] = [];
              }
              return res;
            })
          : [];
    }
    return res;
  }

  async getUserByCode(userCode) {
    const res = await this.userRepo.findOne({
      select: defaultUserSelect as any,
      where: {
        userCode,
        active: true,
      },
      relations: {
        access: true,
        branch: true,
      },
    });

    if (!res) {
      throw Error(USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    if (res.access && res?.access?.accessPages) {
      res.access.accessPages =
        res?.access && res?.access?.accessPages
          ? (
              res.access.accessPages as {
                page: string;
                view: boolean;
                modify: boolean;
                rights: string[];
              }[]
            ).map((res) => {
              if (!res.rights) {
                res["rights"] = [];
              }
              return res;
            })
          : [];
    }
    return res;
  }

  async create(dto: CreateUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = new Users();
      if (!dto.branchId) {
      }
      const branch = await entityManager.findOne(Branch, {
        where: {
          branchId: dto.branchId,
          active: true,
        },
      });

      if (!branch) {
        throw Error(BRANCH_ERROR_NOT_FOUND);
      }
      user.branch = branch;
      user.userName = dto.userName;
      user.password = await hash(dto.password);
      user.accessGranted = true;
      user.fullName = dto.fullName;
      user.email = dto.email;
      user.mobileNumber = dto.mobileNumber;
      user.birthDate = moment(dto.birthDate).format("YYYY-MM-DD");
      if (dto.accessCode) {
        const access = await entityManager.findOne(Access, {
          where: {
            accessId: dto.accessCode,
            active: true,
          },
        });

        if (!access) {
          throw Error(ACCESS_ERROR_NOT_FOUND);
        }
        user.access = access;
      }
      user = await entityManager.save(Users, user);
      user.userCode = generateIndentityCode(user.userId);
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode: user.userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });
      delete user.password;
      if (user.access && user?.access?.accessPages) {
        user.access.accessPages =
          user?.access && user?.access?.accessPages
            ? (
                user.access.accessPages as {
                  page: string;
                  view: boolean;
                  modify: boolean;
                  rights: string[];
                }[]
              ).map((res) => {
                if (!res.rights) {
                  res["rights"] = [];
                }
                return res;
              })
            : [];
      }
      return user;
    });
  }

  async update(userCode, dto: UpdateUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.fullName = dto.fullName;
      user.mobileNumber = dto.mobileNumber;
      user.email = dto.email;
      user.birthDate = moment(dto.birthDate.toString()).format("YYYY-MM-DD");
      user.gender = dto.gender;
      if (dto.accessCode) {
        const access = await entityManager.findOne(Access, {
          where: {
            accessId: dto.accessCode,
            active: true,
          },
        });

        if (!access) {
          throw Error(ACCESS_ERROR_NOT_FOUND);
        }
        user.access = access;
      }
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });
      delete user.password;
      return user;
    });
  }

  async resetPassword(userCode, dto: UpdateUserResetPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.password = await hash(dto.password);
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async deleteUser(userCode) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.active = false;
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async approveAccessRequest(userCode) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        select: defaultUserSelect as any,
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
          branch: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.accessGranted = true;
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }
}
