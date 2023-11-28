import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";

@Entity("article_category", { schema: "StarHub" })
export class ArticleCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 20 })
  name: string | null;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
