import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Article } from "./Article";

@Index("FK_article_TO_photo_1", ["articleId"], {})
@Entity("photo", { schema: "StarHub" })
export class Photo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "article_id" })
  articleId: number;

  @Column("varchar", { name: "image_url", nullable: true, length: 200 })
  imageUrl: string | null;

  @ManyToOne(() => Article, (article) => article.photos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;
}
