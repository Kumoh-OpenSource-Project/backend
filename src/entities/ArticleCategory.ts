import { Column, Entity, OneToMany } from "typeorm";
import { Article } from "./Article";

@Entity("article_category", { schema: "StarHub" })
export class ArticleCategory {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 20 })
  name: string | null;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
