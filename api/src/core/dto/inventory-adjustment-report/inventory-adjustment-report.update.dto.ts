import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsIn,
  IsUppercase,
  IsNumberString,
  IsArray,
  ValidateNested,
} from "class-validator";
import {
  DefaultInventoryAdjustmentReportDto,
  InventoryAdjustmentReportItemDto,
} from "./inventory-adjustment-report-base.dto";
import { Transform, Type } from "class-transformer";
import { CreateInventoryAdjustmentReportItemDto } from "./inventory-adjustment-report.create.dto";

export class ReviewInventoryAdjustmentReportItemDto extends InventoryAdjustmentReportItemDto {
  @ApiProperty({
    default: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  proposedUnitReturnRate = 0;
}

export class UpdateInventoryAdjustmentReportDto extends DefaultInventoryAdjustmentReportDto {
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
export class ProcessInventoryAdjustmentReportStatusDto {
  @IsNotEmpty()
  status = "REVIEWED";

  @ApiProperty({
    isArray: true,
    type: ReviewInventoryAdjustmentReportItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ReviewInventoryAdjustmentReportItemDto)
  @ValidateNested()
  inventoryAdjustmentReportItems: ReviewInventoryAdjustmentReportItemDto[] = [];
}

export class CloseInventoryAdjustmentReportStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["REJECTED", "COMPLETED", "CANCELLED"])
  @IsUppercase()
  status: "REJECTED" | "COMPLETED" | "CANCELLED";

  @ApiProperty({
    type: String,
    default: "Notes",
  })
  @IsNotEmpty()
  notes: string;
}
