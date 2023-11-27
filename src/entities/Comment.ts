import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Article } from "./Article";
import { User } from "./User";

@Index("FK_article_TO_comment_1", ["articleId"], {})
@Index("FK_user_TO_comment_1", ["userId"], {})
@Entity("comment", { schema: "StarHub" })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "article_id" })
  articleId: number;

  @Column("varchar", { name: "context_text", nullable: true, length: 200 })
  contextText: string | null;

  @Column("timestamp", { name: "date", nullable: true })
  date: Timestamp | null;

  @Column("int", { name: "user_id"})
  userId: number;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  
  @JoinColumn([{ name: "article_id", referencedColumnName: "id" }])
  article: Article;
  
  @ManyToOne(() => User, user => user.id) 
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

}
