import { BadRequestException } from "@nestjs/common";
import {  IsArray, IsIn, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateArticleDto {
    
    @IsIn(['scope', 'place', 'photo'])
    @IsString()
    @IsNotEmpty()
    type: string;



    @IsString()
    @IsNotEmpty()
    @Matches(/^[^\s]{2,}$/, { message: '공백 없이 최소 두 글자 이상 입력해주세요.' })
    title: string;



    @IsString()
    @IsNotEmpty()
    @Matches(/^[^\s]{5,}$/, { message: '공백 없이 최소 두 글자 이상 입력해주세요.' })
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
