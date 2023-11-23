import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { DefaultInventoryRequestRateDto } from "./inventory-request-rate-base.dto";

export class CreateInventoryRequestRateDto extends DefaultInventoryRequestRateDto {
  @ApiProperty()
  @IsNotEmpty()
  itemId: string;
}
