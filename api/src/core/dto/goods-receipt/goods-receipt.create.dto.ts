import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { DefaultGoodsReceiptDto } from "./goods-receipt-base.dto";

export class CreateGoodsReceiptDto extends DefaultGoodsReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  createdByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  warehouseCode: string;
}
