"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModule = void 0;
const common_1 = require("@nestjs/common");
const item_controller_1 = require("./item.controller");
const Item_1 = require("../../db/entities/Item");
const item_service_1 = require("../../services/item.service");
const typeorm_1 = require("@nestjs/typeorm");
let ItemModule = class ItemModule {
};
ItemModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Item_1.Item])],
        controllers: [item_controller_1.ItemController],
        providers: [item_service_1.ItemService],
        exports: [item_service_1.ItemService],
    })
], ItemModule);
exports.ItemModule = ItemModule;
//# sourceMappingURL=item.module.js.map