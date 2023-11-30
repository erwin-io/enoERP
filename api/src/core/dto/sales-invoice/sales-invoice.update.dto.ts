import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultSalesInvoiceDto } from "./sales-invoice-base.dto";

export class UpdateSalesInvoiceDto extends DefaultSalesInvoiceDto {}
