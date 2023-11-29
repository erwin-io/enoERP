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


export class GoodsIssueItemDto {
  @ApiProperty()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  quantity = 0;
}


export class DefaultGoodsIssueDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    isArray: true,
    type: GoodsIssueItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => GoodsIssueItemDto)
  @ValidateNested()
  goodsIssueItems: GoodsIssueItemDto[] = [];

  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["RETURN", "DAMAGE", "DISCREPANCY"])
  @IsUppercase()
  issueType: "PENDING" | "DAMAGE" | "DISCREPANCY";
}