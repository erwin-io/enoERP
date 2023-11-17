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

export class DefaultBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  branchCode: string;
}