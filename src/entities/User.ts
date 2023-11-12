import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";
import { UserClipped } from "./UserClipped";
import { UserCommentLike } from "./UserCommentLike";
import { UserLike } from "./UserLike";

@Entity("user", { schema: "StarHub" })
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "nick_name", nullable: true, length: 20, unique: true })
  nickName: string | null;

  @Column("varchar", { name: "level", nullable: true, length: 20 })
  level: string | null;

  @Column("mediumtext", { name: "profile_photo", nullable: true })
  profilePhoto: string | null;

  @Column("bigint", { name: "kakao_id", nullable: false })
  kakaoId: number;

  @OneToMany(() => Article, (article) => article.writer)
  articles: Article[];

  @OneToMany(() => UserClipped, (userClipped) => userClipped.user)
  userClippeds: UserClipped[];

  @OneToMany(() => UserCommentLike, (userCommentLike) => userCommentLike.user)
  userCommentLikes: UserCommentLike[];

  @OneToMany(() => UserLike, (userLike) => userLike.user)
  userLikes: UserLike[];
}
