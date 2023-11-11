import { Column, Entity } from "typeorm";

@Entity("events", { schema: "StarHub" })
export class Events {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "title", nullable: true, length: 50 })
  title: string | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;
}
