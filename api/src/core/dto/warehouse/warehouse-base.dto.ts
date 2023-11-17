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

export class DefaultWarehouseDto {
  @ApiProperty()
  @IsNotEmpty()
  warehouseCode: string;
  
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}