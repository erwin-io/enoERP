import { InventoryRequestItem } from "./../entities/InventoryRequestItem";
import { InventoryRequest } from "./../entities/InventoryRequest";
import { Users } from "../entities/Users";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { Access } from "../entities/Access";
import { ItemCategory } from "../entities/ItemCategory";
import { Item } from "../entities/Item";
import { Warehouse } from "../entities/Warehouse";
import { ItemWarehouse } from "../entities/ItemWarehouse";
import { Branch } from "../entities/Branch";
import { ItemBranch } from "../entities/ItemBranch";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const ssl = this.config.get<string>("SSL");
    const config: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users,
        Access,
        ItemCategory,
        Item,
        Warehouse,
        ItemWarehouse,
        Branch,
        ItemBranch,
        InventoryRequest,
        InventoryRequestItem,
      ],
      synchronize: false, // never use TRUE in production!
      ssl: ssl.toLocaleLowerCase().includes("true"),
      extra: {},
    };
    if (config.ssl) {
      config.extra.ssl = {
        require: true,
        rejectUnauthorized: false,
      };
    }
    return config;
  }
}
