import {  IsNotEmpty, IsNumber, } from 'class-validator';

export class ArticleIdDto {
    @IsNumber()
    @IsNotEmpty()
    articleId: number;
}
