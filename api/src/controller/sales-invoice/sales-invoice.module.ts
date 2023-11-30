import { Module } from "@nestjs/common";
import { SalesInvoiceController } from "./sales-invoice.controller";
import { SalesInvoice } from "src/db/entities/SalesInvoice";
import { SalesInvoiceService } from "src/services/sales-invoice.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([SalesInvoice])],
  controllers: [SalesInvoiceController],
  providers: [SalesInvoiceService],
  exports: [SalesInvoiceService],
})
export class SalesInvoiceModule {}
