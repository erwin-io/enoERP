/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { InventoryRequest } from "src/db/entities/InventoryRequest";

const Pusher = require("pusher");

@Injectable()
export class PusherService {
  pusher;
  constructor(private readonly config: ConfigService) {
    this.pusher = new Pusher({
      appId: this.config.get<string>("PUSHER_APPID"),
      key: this.config.get<string>("PUSHER_KEY"),
      secret: this.config.get<string>("PUSHER_SECRET"),
      cluster: this.config.get<string>("PUSHER_CLUSTER"),
      useTLS: this.config
        .get<string>("PUSHER_USE_TLS")
        .toLowerCase()
        .includes("true"),
    });
  }
  trigger(channel, event, data: any) {
    this.pusher.trigger(channel, event, data);
  }

  async reSync(type: string, data: any) {
    try {
      this.pusher.trigger("all", "reSync", { type, data });
    } catch (ex) {
      throw ex;
    }
  }

  async inventoryRequestChanges(
    userIds: string[],
    inventoryRequest: InventoryRequest
  ) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          this.pusher.trigger(
            userId,
            "inventoryRequestChanges",
            inventoryRequest
          );
        }
      }
      this.pusher.trigger("all", "reSync", {
        type: "INVENTORY_REQUEST",
        data: null,
      });
    } catch (ex) {
      throw ex;
    }
  }

  async goodsIssueChanges(userIds: string[], goodsIssue: GoodsIssue) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          this.pusher.trigger(userId, "goodsIssueChanges", goodsIssue);
        }
      }
      this.pusher.trigger("all", "reSync", { type: "GOODS_ISSUE", data: null });
    } catch (ex) {
      throw ex;
    }
  }

  async goodsReceiptChanges(userIds: string[], goodsReceipt: GoodsReceipt) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          this.pusher.trigger(userId, "goodsReceiptChanges", goodsReceipt);
        }
      }
      this.pusher.trigger("all", "reSync", {
        type: "GOODS_RECEIPT",
        data: null,
      });
    } catch (ex) {
      throw ex;
    }
  }

  async sendNotif(userIds: string[], title: string, description) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          this.pusher.trigger(userId, "notifAdded", {
            title,
            description,
          });
        }
      }
    } catch (ex) {
      throw ex;
    }
  }
}
