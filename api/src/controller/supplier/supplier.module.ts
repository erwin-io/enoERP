import { Module } from "@nestjs/common";
import { SupplierController } from "./supplier.controller";
import { Supplier } from "src/db/entities/Supplier";
import { SupplierService } from "src/services/supplier.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
