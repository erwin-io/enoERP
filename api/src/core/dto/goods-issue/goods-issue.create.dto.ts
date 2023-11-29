import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { DefaultGoodsIssueDto } from "./goods-issue-base.dto";

export class CreateGoodsIssueDto extends DefaultGoodsIssueDto {
  @ApiProperty()
  @IsNotEmpty()
  createdByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  warehouseCode: string;
}
