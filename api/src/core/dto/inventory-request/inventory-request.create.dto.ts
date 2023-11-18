import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { DefaultInventoryRequestDto } from "./inventory-request-base.dto";

export class CreateInventoryRequestDto extends DefaultInventoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  requestedByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  branchId: string;
}
