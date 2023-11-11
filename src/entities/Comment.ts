import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";
import { UserCommentLike } from "./UserCommentLike";

@Index("FK_article_TO_comment_1", ["articleId"], {})
@Entity("comment", { schema: "StarHub" })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "article_id" })
  articleId: number;

  @Column("varchar", { name: "context_text", nullable: true, length: 200 })
  contextText: string | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("int", { name: "like", nullable: true })
  like: number | null;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;

  @OneToMany(
    () => UserCommentLike,
    (userCommentLike) => userCommentLike.comment
  )
  userCommentLikes: UserCommentLike[];
}
