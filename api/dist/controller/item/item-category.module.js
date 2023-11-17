"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const item_category_controller_1 = require("./item-category.controller");
const ItemCategory_1 = require("../../db/entities/ItemCategory");
const item_category_service_1 = require("../../services/item-category.service");
const typeorm_1 = require("@nestjs/typeorm");
let ItemCategoryModule = class ItemCategoryModule {
};
ItemCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ItemCategory_1.ItemCategory])],
        controllers: [item_category_controller_1.ItemCategoryController],
        providers: [item_category_service_1.ItemCategoryService],
        exports: [item_category_service_1.ItemCategoryService],
    })
], ItemCategoryModule);
exports.ItemCategoryModule = ItemCategoryModule;
//# sourceMappingURL=item-category.module.js.map