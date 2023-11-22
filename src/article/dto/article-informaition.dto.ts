import { IsIn, IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';

export class ArticleInformationDto {
    @IsIn(['scope', 'place', 'photo'])
    @IsString()
    @IsNotEmpty()
    type: string;

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

