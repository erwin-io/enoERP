import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { Notifications } from "src/db/entities/Notifications";
import { Repository } from "typeorm";
import { PusherService } from "./pusher.service";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,
    private pusherService: PusherService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
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

  async markAsRead(notificationId: string) {
    return await this.notificationsRepo.manager.transaction(
      async (entityManager) => {
        const notification = await entityManager.findOne(Notifications, {
          where: {
            notificationId,
          },
        });
        notification.isRead = true;
        return await entityManager.save(Notifications, notification);
      }
    );
  }

  async getUnreadByUser(userId: string) {
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
    this.pusherService.sendNotif([userId], title, description);
  }
}
