import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("Access_pkey", ["accessId"], { unique: true })
@Entity("Access", { schema: "dbo" })
export class Access {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AccessId" })
  accessId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("json", { name: "AccessPages", default: [] })
  accessPages: object;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Users, (users) => users.access)
  users: Users[];
}
