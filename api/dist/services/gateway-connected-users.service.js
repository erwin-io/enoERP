"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayConnectedUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const GatewayConnectedUsers_1 = require("../db/entities/GatewayConnectedUsers");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
let GatewayConnectedUsersService = class GatewayConnectedUsersService {
    constructor(gatewayConnectedUsersRepo) {
        this.gatewayConnectedUsersRepo = gatewayConnectedUsersRepo;
    }
    async findByUserId(userId = "") {
        try {
            if (userId && userId !== undefined) {
                return await this.gatewayConnectedUsersRepo.findOneBy({
                    user: { userId },
                });
            }
            else {
                return null;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async findByUserIds(userIds) {
        try {
            if (userIds && userIds !== undefined) {
                const query = await this.gatewayConnectedUsersRepo.manager.query(`
        select MAX(cu."UserId") as "userId", MAX(cu."SocketId") as "socketId", MAX(n."unRead") as "unRead"
        from dbo."GatewayConnectedUsers" cu 
        LEFT JOIN 
        (
          SELECT "UserId", COUNT("NotificationId") as "unRead"
          FROM dbo."Notifications" GROUP BY "UserId"
          ) n ON cu."UserId" = n."UserId"
        WHERE cu."UserId" IN(SELECT UNNEST(STRING_TO_ARRAY('${userIds.toString()}', ',')):: int)
        GROUP BY cu."UserId"`);
                return query;
            }
            else {
                return null;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async add({ userId = "", socketId = "" }) {
        try {
            if (userId &&
                userId !== undefined &&
                socketId &&
                socketId !== undefined) {
                return await this.gatewayConnectedUsersRepo.manager.transaction(async (entityManager) => {
                    const connectedUser = await entityManager.findOne(GatewayConnectedUsers_1.GatewayConnectedUsers, {
                        where: { user: { userId } },
                        relations: {
                            user: true,
                        },
                    });
                    if (connectedUser) {
                        connectedUser.socketId = socketId;
                        return await entityManager.save(GatewayConnectedUsers_1.GatewayConnectedUsers, connectedUser);
                    }
                    else {
                        const newConnectedUser = new GatewayConnectedUsers_1.GatewayConnectedUsers();
                        newConnectedUser.user = await entityManager.findOne(Users_1.Users, {
                            where: { userId },
                        });
                        newConnectedUser.socketId = socketId;
                        return await entityManager.save(GatewayConnectedUsers_1.GatewayConnectedUsers, newConnectedUser);
                    }
                });
            }
            else {
                return null;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async deleteByUserId(userId = "") {
        try {
            if (!userId || userId === undefined || userId === "undefined") {
                return null;
            }
            return await this.gatewayConnectedUsersRepo.manager.transaction(async (entityManager) => {
                const gatewayConnectedUsers = await entityManager.find(GatewayConnectedUsers_1.GatewayConnectedUsers, {
                    where: { user: { userId } },
                });
                if (gatewayConnectedUsers) {
                    return await entityManager.delete(GatewayConnectedUsers_1.GatewayConnectedUsers, gatewayConnectedUsers);
                }
                else {
                    return null;
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
    async deleteAll() {
        try {
            await this.gatewayConnectedUsersRepo
                .createQueryBuilder()
                .delete()
                .execute();
        }
        catch (e) {
            throw e;
        }
    }
};
GatewayConnectedUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(GatewayConnectedUsers_1.GatewayConnectedUsers)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GatewayConnectedUsersService);
exports.GatewayConnectedUsersService = GatewayConnectedUsersService;
//# sourceMappingURL=gateway-connected-users.service.js.map