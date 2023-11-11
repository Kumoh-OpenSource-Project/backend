import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Index("FK_comment_TO_user_comment_like_1", ["commentId"], {})
@Index("FK_user_TO_user_comment_like_1", ["userId"], {})
@Entity("user_comment_like", { schema: "StarHub" })
export class UserCommentLike {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "comment_id" })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.userCommentLikes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "comment_id", referencedColumnName: "id" }])
  comment: Comment;

  @ManyToOne(() => User, (user) => user.userCommentLikes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
