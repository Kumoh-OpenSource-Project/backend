import {  IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateArticleDto {
@IsString()
@IsNotEmpty()
@MinLength(5, { message: "제목은 5자 이상이여야 합니다." })
title: string;


@IsNumber()
@IsNotEmpty()
articleCategory: number;

@IsString()
@IsNotEmpty()
@MinLength(10, { message: "내용은 10자 이상이여야 합니다." })
contextText: string;

}
