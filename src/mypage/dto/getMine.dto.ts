import { Timestamp } from "typeorm";

export class getMineDto{
  articleId: number;
  category: number;
  title: string;
  content: string;
  nickName: string;
  writeDate: Timestamp;
}