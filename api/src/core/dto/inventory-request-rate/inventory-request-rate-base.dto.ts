import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class DefaultInventoryRequestRateDto {
  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  rate = 0;

  @ApiProperty()
  @IsNotEmpty()
  rateName: string;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  minQuantity = 0;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  maxQuantity = 0;
}