import { IsNotEmpty, IsNumberString, IsString, MinLength } from 'class-validator';

export class SearchContextDto {
    
@IsString()
@MinLength(2, {message: '최소 두글자 이상 작성해주세요.'})
@IsNotEmpty()
search: string;

@IsNumberString()
@IsNotEmpty()
offset: string;

}
