import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Item } from "./Item";

@Index("u_itemcategory", ["active", "name"], { unique: true })
@Index("ItemCategory_pkey", ["itemCategoryId"], { unique: true })
@Entity("ItemCategory", { schema: "dbo" })
export class ItemCategory {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ItemCategoryId" })
  itemCategoryId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Item, (item) => item.itemCategory)
  items: Item[];
}
