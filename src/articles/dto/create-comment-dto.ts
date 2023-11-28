import { BadRequestException } from "@nestjs/common";
import {  IsArray, IsIn, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: "내용은 2자 이상이여야 합니다." })
    content: string;
}
