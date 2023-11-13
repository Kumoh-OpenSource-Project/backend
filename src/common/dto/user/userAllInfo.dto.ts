import { IsNotEmpty, IsString } from 'class-validator';

export class UserAllInfoDto {
  @IsNotEmpty()
  @IsString()
  userNickName: string;
  
  @IsNotEmpty()
  @IsString()
  userImage: string;
}
