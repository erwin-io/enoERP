import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { Notifications } from "src/db/entities/Notifications";
import { NotificationsService } from "src/services/notifications.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "src/core/gateway/chat.gateway";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, GatewayConnectedUsers])],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    ChatGateway,
    GatewayConnectedUsersService,
    PusherService,
  ],
  exports: [
    NotificationsService,
    ChatGateway,
    GatewayConnectedUsersService,
    PusherService,
  ],
})
export class NotificationsModule {}
