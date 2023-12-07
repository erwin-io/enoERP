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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const utils_1 = require("../common/utils/utils");
const Notifications_1 = require("../db/entities/Notifications");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
let NotificationsService = class NotificationsService {
    constructor(notificationsRepo, pusherService) {
        this.notificationsRepo = notificationsRepo;
        this.pusherService = pusherService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.notificationsRepo.find({
                where: condition,
                skip,
                take,
                order,
                relations: {
                    user: true,
                },
            }),
            this.notificationsRepo.count({
                where: condition,
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async markAsRead(notificationId) {
        return await this.notificationsRepo.manager.transaction(async (entityManager) => {
            const notification = await entityManager.findOne(Notifications_1.Notifications, {
                where: {
                    notificationId,
                },
            });
            notification.isRead = true;
            return await entityManager.save(Notifications_1.Notifications, notification);
        });
    }
    async getUnreadByUser(userId) {
        return this.notificationsRepo.count({
            where: {
                user: {
                    userId,
                    active: true,
                },
                isRead: false,
            },
        });
    }
    async test({ userId, title, description }) {
        this.pusherService.sendNotif(userId, title, description);
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Notifications_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map