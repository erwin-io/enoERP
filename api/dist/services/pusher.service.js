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
};
PusherService = __decorate([
    (0, common_1.Injectable)()
], PusherService);
exports.PusherService = PusherService;
//# sourceMappingURL=pusher.service.js.map