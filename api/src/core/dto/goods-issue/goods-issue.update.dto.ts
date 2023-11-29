import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultGoodsIssueDto } from "./goods-issue-base.dto";

export class UpdateGoodsIssueDto extends DefaultGoodsIssueDto {}

export class UpdateGoodsIssueStatusDto {
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
}
