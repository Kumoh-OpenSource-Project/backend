import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Article } from "./Article";
import { User } from "./User";

@Index("FK_article_TO_user_like_1", ["articleId"], {})
@Index("FK_user_TO_user_like_1", ["userId"], {})
@Entity("user_like", { schema: "StarHub" })
export class UserLike {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "article_id" })
  articleId: number;

  @ManyToOne(() => Article, (article) => article.userLikes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;

  @ManyToOne(() => User, (user) => user.userLikes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
