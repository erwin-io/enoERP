import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultGoodsReceiptDto } from "./goods-receipt-base.dto";

export class UpdateGoodsReceiptDto extends DefaultGoodsReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  updatedByUserId: string;
}

export class UpdateGoodsReceiptStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["PENDING", "REJECTED", "COMPLETED", "CANCELLED"])
  @IsUppercase()
  status: "PENDING" | "REJECTED" | "COMPLETED" | "CANCELLED";
  @ApiProperty({
    type: String,
    default: "Notes",
  })
  @IsNotEmpty()
  notes: string;

  @ApiProperty()
  @IsNotEmpty()
  updatedByUserId: string;
}
