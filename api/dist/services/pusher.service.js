"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherService = void 0;
const common_1 = require("@nestjs/common");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1720928",
    key: "1ad4b93854243ae307e6",
    secret: "e8cf7208e15a53279f1a",
    cluster: "ap1",
    useTLS: true,
});
let PusherService = class PusherService {
    trigger(channel, event, data) {
        pusher.trigger(channel, event, data);
    }
    async reSync(type, data) {
        try {
            pusher.trigger("all", "reSync", { type, data });
        }
        catch (ex) {
            throw ex;
        }
    }
    async inventoryRequestChanges(userIds, inventoryRequest) {
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
        }
        catch (ex) {
            throw ex;
        }
    }
    async goodsIssueChanges(userIds, goodsIssue) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    pusher.trigger(userId, "goodsIssueChanges", goodsIssue);
                }
            }
            pusher.trigger("all", "reSync", { type: "GOODS_ISSUE", data: null });
        }
        catch (ex) {
            throw ex;
        }
    }
    async goodsReceiptChanges(userIds, goodsReceipt) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    pusher.trigger(userId, "goodsReceiptChanges", goodsReceipt);
                }
            }
            pusher.trigger("all", "reSync", { type: "GOODS_RECEIPT", data: null });
        }
        catch (ex) {
            throw ex;
        }
    }
    async sendNotif(userIds, title, description) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    pusher.trigger(userId, "notifAdded", {
                        title,
                        description,
                    });
                }
            }
        }
        catch (ex) {
            throw ex;
        }
    }
};
PusherService = __decorate([
    (0, common_1.Injectable)()
], PusherService);
exports.PusherService = PusherService;
//# sourceMappingURL=pusher.service.js.map