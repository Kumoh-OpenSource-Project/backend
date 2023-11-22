import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import {  IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    
    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, {message: '최소 10자 이상 작성하여야 합니다.'})
    content: string;

}
