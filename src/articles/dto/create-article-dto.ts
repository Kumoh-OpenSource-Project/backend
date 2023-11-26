import { BadRequestException } from "@nestjs/common";
import {  IsArray, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateArticleDto {
    
    @IsIn(['scope', 'place', 'photo'])
    @IsString()
    @IsNotEmpty()
    type: string;



    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: "제목은 5자 이상이여야 합니다." })
    title: string;



    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: "내용은 10자 이상이여야 합니다." })
    content: string;

    @IsArray()
    photo?:Array<string>;

    static mapTypeToNumber(type: string): number {
        switch (type) {
          case 'scope': return 1;
          case 'place' : return 2;
          case 'photo': return 3;
          default: throw new BadRequestException(['올바르지 않은 type 삽입입니다.']);
        }
      }

}
