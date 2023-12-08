import { BadRequestException } from "@nestjs/common";
import {  IsArray, IsIn, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[^\s]{2,}$/, { message: '공백 없이 최소 두 글자 이상 입력해주세요.' })
    content: string;
}
