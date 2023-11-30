import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { DefaultSalesInvoiceDto } from "./sales-invoice-base.dto";

export class CreateSalesInvoiceDto extends DefaultSalesInvoiceDto {
}
