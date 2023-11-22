import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import {  IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(10, {message: '최소 10자 이상 작성하여야 합니다.'})
    contextText: string;

}
