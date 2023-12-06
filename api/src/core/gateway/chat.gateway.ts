import {
  HttpException,
  HttpStatus,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { MessagingDevicesResponse } from "firebase-admin/lib/messaging/messaging-api";
import { Socket } from "socket.io";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { Users } from "src/db/entities/Users";
import { AuthService } from "src/services/auth.service";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";
import { UsersService } from "src/services/users.service";
import { Repository } from "typeorm";

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer() server;
  constructor(
    private gatewayConnectedUsersService: GatewayConnectedUsersService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onModuleInit() {
    console.log("start");
  }

  async handleConnection(socket: Socket) {
    try {
      const userId: any =
        socket?.handshake?.headers && socket?.handshake?.headers["userid"]
          ? socket?.handshake?.headers["userid"]
          : null;
      if (
        userId &&
        userId !== "undefined" &&
        !isNaN(Number(userId)) &&
        socket.id
      ) {
        const gateway = await this.gatewayConnectedUsersService.findByUserId(
          userId
        );
        if (!gateway) {
          await this.gatewayConnectedUsersService.add({
            userId,
            socketId: socket.id,
          });
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      // remove connection from DB
      const userId: any =
        socket?.handshake?.headers && socket?.handshake?.headers["userid"]
          ? socket?.handshake?.headers["userid"]
          : null;
      if (userId && userId !== "undefined" && !isNaN(Number(userId))) {
        const gateway = await this.gatewayConnectedUsersService.findByUserId(
          userId
        );
        if (gateway) {
          await this.gatewayConnectedUsersService.deleteByUserId(userId);
        }
      }
      socket.disconnect();
    } catch (ex) {
      console.log(ex);
    }
  }

  private disconnect(socket: Socket) {
    // remove connection from DB
    const userId: any =
      socket?.handshake?.headers && socket?.handshake?.headers["userid"]
        ? socket?.handshake?.headers["userid"]
        : null;
    if (userId && userId !== "undefined" && !isNaN(Number(userId))) {
      this.gatewayConnectedUsersService
        .deleteByUserId(userId)
        .then(
          (res) => {
            socket.emit("Error", new UnauthorizedException());
            socket.disconnect();
          },
          () => {
            socket.emit("Error", new UnauthorizedException());
            socket.disconnect();
          }
        )
        .catch((err) => {
          socket.emit("Error", new UnauthorizedException());
          socket.disconnect();
        });
    }
  }

  @SubscribeMessage("reSync")
  async reSync(type: string, data: any) {
    try {
      await this.server.emit("reSync", { type, data });
    } catch (ex) {
      throw ex;
    }
  }

  @SubscribeMessage("inventoryRequestChanges")
  async inventoryRequestChanges(
    userIds: string[],
    inventoryRequest: InventoryRequest
  ) {
    try {
      const gateWays = await this.gatewayConnectedUsersService.findByUserIds(
        userIds
      );
      if (gateWays && gateWays.length > 0) {
        for (const gateWay of gateWays) {
          await this.server
            .to(gateWay.socketId)
            .emit("inventoryRequestChanges", inventoryRequest);
        }
      }
      await this.server.emit("reSync", {
        type: "INVENTORY_REQUEST",
        data: null,
      });
    } catch (ex) {
      throw ex;
    }
  }

  @SubscribeMessage("goodsIssueChanges")
  async goodsIssueChanges(userIds: string[], goodsIssue: GoodsIssue) {
    try {
      const gateWays = await this.gatewayConnectedUsersService.findByUserIds(
        userIds
      );
      if (gateWays && gateWays.length > 0) {
        for (const gateWay of gateWays) {
          await this.server
            .to(gateWay.socketId)
            .emit("goodsIssueChanges", goodsIssue);
        }
      }
      await this.server.emit("reSync", { type: "GOODS_ISSUE", data: null });
    } catch (ex) {
      throw ex;
    }
  }

  @SubscribeMessage("goodsReceiptChanges")
  async goodsReceiptChanges(userIds: string[], goodsReceipt: GoodsReceipt) {
    try {
      const gateWays = await this.gatewayConnectedUsersService.findByUserIds(
        userIds
      );
      if (gateWays && gateWays.length > 0) {
        for (const gateWay of gateWays) {
          await this.server
            .to(gateWay.socketId)
            .emit("goodsReceiptChanges", goodsReceipt);
        }
      }
      await this.server.emit("reSync", { type: "GOODS_RECEIPT", data: null });
    } catch (ex) {
      throw ex;
    }
  }

  @SubscribeMessage("notifAdded")
  async sendNotif(userIds: string[], title: string, description) {
    try {
      const gateWays = await this.gatewayConnectedUsersService.findByUserIds(
        userIds
      );
      if (gateWays && gateWays.length > 0) {
        for (const gateWay of gateWays) {
          await this.server.to(gateWay.socketId).emit("notifAdded", {
            title,
            description,
            unRead: gateWay.unRead,
          });
        }
      }
    } catch (ex) {
      throw ex;
    }
  }
}
