import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumberString, Matches } from "class-validator";

export class DefaultItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\S*$/)
  itemCode: string;

  @ApiProperty()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  itemCategoryId: string;
}
