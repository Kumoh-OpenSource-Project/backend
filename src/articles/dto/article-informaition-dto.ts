import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class ArticleInformationDto {
    @IsOptional()  
    @IsIn(['scope', 'place', 'photo'])
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    @MinLength(2, {message: '최소 두글자 이상 작성해주세요.'})
    search?: string;

    @IsNumberString()
    @IsNotEmpty()
    offset: string;
    
    static mapTypeToNumber(type: string): number {
        switch (type) {
          case 'scope': return 1;
          case 'place' : return 2;
          case 'photo': return 3;
          default: throw new BadRequestException(['올바르지 않은 type 삽입입니다.']);
        }
      }
}

