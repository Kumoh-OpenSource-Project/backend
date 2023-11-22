import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import {  IsNotEmpty, IsNumber, } from 'class-validator';

export class ArticleIdDto {
    @IsNumber()
    @IsNotEmpty()
    articleId: number;
}
