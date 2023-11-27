import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
} from "class-validator";

export class InventoryAdjustmentReportItemDto {
  @ApiProperty()
  @IsNotEmpty()
  itemId: string;
}

export class DefaultInventoryAdjustmentReportDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["RETURN", "DAMAGE", "DISCREPANCY"])
  @IsUppercase()
  reportType: "RETURN" | "DAMAGE" | "DISCREPANCY";
}
