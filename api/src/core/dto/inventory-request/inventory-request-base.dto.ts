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


export class InventoryRequestItemDto {
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


export class DefaultInventoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    isArray: true,
    type: InventoryRequestItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => InventoryRequestItemDto)
  @ValidateNested()
  inventoryRequestItems: InventoryRequestItemDto[] = [];
}