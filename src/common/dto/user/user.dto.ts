import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  userNickName: string;

  @IsString()
  @IsOptional()
  userImage: string;
}
