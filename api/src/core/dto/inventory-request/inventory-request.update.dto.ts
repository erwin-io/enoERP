import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultInventoryRequestDto } from "./inventory-request-base.dto";

export class UpdateInventoryRequestDto extends DefaultInventoryRequestDto {}
export class ProcessInventoryRequestStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn([
    "PENDING",
    "REJECTED",
    "PROCESSING",
    "IN-TRANSIT",
    "COMPLETED",
    "CANCELLED",
    "PARTIALLY-FULFILLED",
  ])
  @IsUppercase()
  status:
    | "PENDING"
    | "REJECTED"
    | "PROCESSING"
    | "IN-TRANSIT"
    | "COMPLETED"
    | "CANCELLED"
    | "PARTIALLY-FULFILLED";
}

export class CloseInventoryRequestStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn([
    "PENDING",
    "REJECTED",
    "PROCESSING",
    "IN-TRANSIT",
    "COMPLETED",
    "CANCELLED",
    "PARTIALLY-FULFILLED",
  ])
  @IsUppercase()
  status:
    | "PENDING"
    | "REJECTED"
    | "PROCESSING"
    | "IN-TRANSIT"
    | "COMPLETED"
    | "CANCELLED"
    | "PARTIALLY-FULFILLED";

  @ApiProperty({
    type: String,
    default: "Notes",
  })
  @IsNotEmpty()
  notes: string;
}
