import {  IsNotEmpty, IsNumber, } from 'class-validator';

export class CommentIdDto {
    @IsNumber()
    @IsNotEmpty()
    commentId: number;
}
