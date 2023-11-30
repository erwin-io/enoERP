import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
} from "class-validator";


export class SalesInvoiceItemDto {
  @ApiProperty()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNotIn([0])
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  quantity = 0;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNotIn([0])
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  unitPrice: 0;
}


export class DefaultSalesInvoiceDto {
  @ApiProperty()
  @IsNotEmpty()
  createdByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({
    isArray: true,
    type: SalesInvoiceItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => SalesInvoiceItemDto)
  @ValidateNested()
  salesInvoiceItems: SalesInvoiceItemDto[] = [];
}