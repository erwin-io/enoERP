import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { UsersModule } from "./controller/users/users.module";
import { AccessModule } from "./controller/access/access.module";
import { ItemCategoryModule } from "./controller/item-category/item-category.module";
import { ItemModule } from "./controller/item/item.module";
import { WarehouseModule } from "./controller/warehouse/warehouse.module";
import { BranchModule } from "./controller/branch/branch.module";
import { InventoryMasterlistModule } from "./controller/inventory-masterlist/inventory-masterlist.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { InventoryRequestModule } from "./controller/inventory-request/inventory-request.module";
import { WarehouseInventoryModule } from "./controller/warehouse-inventory/warehouse-inventory.module";
import { InventoryRequestRateModule } from "./controller/inventory-request-rate/inventory-request-rate.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    AccessModule,
    ItemCategoryModule,
    ItemModule,
    WarehouseModule,
    BranchModule,
    InventoryMasterlistModule,
    InventoryRequestModule,
    WarehouseInventoryModule,
    InventoryRequestRateModule,
    FirebaseProviderModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
