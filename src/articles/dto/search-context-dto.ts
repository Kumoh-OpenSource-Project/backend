import { IsNotEmpty, IsNumberString, IsString, Matches, MinLength } from 'class-validator';

export class SearchContextDto {
    
@IsString()
@Matches(/^[^\s]{2,}$/, { message: '공백 없이 최소 두 글자 이상 입력해주세요.' })
@IsNotEmpty()
search: string;

@IsNumberString()
@IsNotEmpty()
offset: string;

}
