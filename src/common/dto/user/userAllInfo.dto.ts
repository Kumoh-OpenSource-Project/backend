import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserAllInfoDto {
  @IsNotEmpty()
  @IsString()
  userNickName: string;

  @IsString()
  userImage: string;
}
