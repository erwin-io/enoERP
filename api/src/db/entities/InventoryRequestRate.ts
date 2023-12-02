import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InventoryRequestItem } from "./InventoryRequestItem";
import { Item } from "./Item";

@Index("u_inventoryrequestrate_rate", ["active", "itemId", "rate"], {
  unique: true,
})
@Index("u_inventoryrequestrate", ["active", "itemId", "rateName"], {
  unique: true,
})
@Index("InventoryRequestRate_pkey", ["inventoryRequestRateId"], {
  unique: true,
})
@Entity("InventoryRequestRate", { schema: "dbo" })
export class InventoryRequestRate {
  @PrimaryGeneratedColumn({ type: "bigint", name: "InventoryRequestRateId" })
  inventoryRequestRateId: string;

  @Column("bigint", { name: "ItemId" })
  itemId: string;

  @Column("numeric", { name: "Rate" })
  rate: string;

  @Column("character varying", { name: "RateName" })
  rateName: string;

  @Column("bigint", { name: "MinQuantity", default: () => "0" })
  minQuantity: string;

  @Column("bigint", { name: "MaxQuantity", default: () => "0" })
  maxQuantity: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("boolean", { name: "BaseRate", default: () => "false" })
  baseRate: boolean;

  @Column("character varying", {
    name: "InventoryRequestRateCode",
    nullable: true,
  })
  inventoryRequestRateCode: string | null;

  @OneToMany(
    () => InventoryRequestItem,
    (inventoryRequestItem) => inventoryRequestItem.inventoryRequestRate
  )
  inventoryRequestItems: InventoryRequestItem[];

  @ManyToOne(() => Item, (item) => item.inventoryRequestRates)
  @JoinColumn([{ name: "ItemId", referencedColumnName: "itemId" }])
  item: Item;
}
