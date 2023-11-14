import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticleCategory } from "./ArticleCategory";
import { User } from "./User";
import { Comment } from "./Comment";
import { Photo } from "./Photo";
import { UserClipped } from "./UserClipped";
import { UserLike } from "./UserLike";

@Index("FK_article_category_TO_article_1", ["categoryId"], {})
@Index("FK_user_TO_article_1", ["writerId"], {})
@Entity("article", { schema: "StarHub" })
export class Article {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "writer_id" })
  writerId: number;

  @Column("int", { name: "category_id" })
  categoryId: number;

  @Column("varchar", { name: "title", nullable: true, length: 100 })
  title: string | null;

  @Column("mediumtext", { name: "context_text", nullable: true })
  contextText: string | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("int", { name: "like", nullable: true })
  like: number | null;

  @Column("int", { name: "clipped", nullable: true })
  clipped: number | null;

  @ManyToOne(
    () => ArticleCategory,
    (articleCategory) => articleCategory.articles,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: ArticleCategory;

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "writer_id", referencedColumnName: "id" }])
  writer: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];

  @OneToMany(() => UserClipped, (userClipped) => userClipped.article)
  userClippeds: UserClipped[];

  @OneToMany(() => UserLike, (userLike) => userLike.article)
  userLikes: UserLike[];
}
