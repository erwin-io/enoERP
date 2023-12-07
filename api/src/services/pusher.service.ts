/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { InventoryRequest } from "src/db/entities/InventoryRequest";

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1720928",
  key: "1ad4b93854243ae307e6",
  secret: "e8cf7208e15a53279f1a",
  cluster: "ap1",
  useTLS: true,
});
@Injectable()
export class PusherService {
  trigger(channel, event, data: any) {
    pusher.trigger(channel, event, data);
  }

  async reSync(type: string, data: any) {
    try {
      pusher.trigger("all", "reSync", { type, data });
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
          pusher.trigger(userId, "inventoryRequestChanges", inventoryRequest);
        }
      }
      pusher.trigger("all", "reSync", {
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
          pusher.trigger(userId, "goodsIssueChanges", goodsIssue);
        }
      }
      pusher.trigger("all", "reSync", { type: "GOODS_ISSUE", data: null });
    } catch (ex) {
      throw ex;
    }
  }

  async goodsReceiptChanges(userIds: string[], goodsReceipt: GoodsReceipt) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          pusher.trigger(userId, "goodsReceiptChanges", goodsReceipt);
        }
      }
      pusher.trigger("all", "reSync", { type: "GOODS_RECEIPT", data: null });
    } catch (ex) {
      throw ex;
    }
  }

  async sendNotif(userIds: string[], title: string, description) {
    try {
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          pusher.trigger(userId, "notifAdded", {
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
