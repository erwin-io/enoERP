import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
} from "class-validator";
import {
  DefaultInventoryAdjustmentReportDto,
  InventoryAdjustmentReportItemDto,
} from "./inventory-adjustment-report-base.dto";

export class CreateInventoryAdjustmentReportItemDto extends InventoryAdjustmentReportItemDto {
  @ApiProperty({
    default: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  returnedQuantity = 0;
}

export class CreateInventoryAdjustmentReportDto extends DefaultInventoryAdjustmentReportDto {
  @ApiProperty()
  @IsNotEmpty()
  reportedByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  inventoryRequestCode: string;

  @ApiProperty({
    isArray: true,
    type: CreateInventoryAdjustmentReportItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => CreateInventoryAdjustmentReportItemDto)
  @ValidateNested()
  inventoryAdjustmentReportItems: CreateInventoryAdjustmentReportItemDto[] = [];
}
