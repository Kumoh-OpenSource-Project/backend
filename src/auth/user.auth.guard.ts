// auth.guard.ts

import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from '../entities/User';
import { Repository } from 'typeorm';




@Injectable()
export class UserAuthGuard implements CanActivate {
  private readonly userInfoUrl = process.env.KAKAO_USERINFO_URI
    constructor(
    @InjectRepository(User)
    private readonly userRepo : Repository<User>,
  ){}
  
  async canActivate(context: ExecutionContext): Promise<boolean> { 
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization'];

    if (!accessToken) {
      throw new UnauthorizedException('엑세스 토큰이 없습니다. 다시 로그인하여 주십시오');
    }

    try {
      // Kakao API를 호출하여 토큰을 검증합니다.
      // const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const userInfoHeaders = {
        Authorization: accessToken,
      };

      const { data } = await axios.get(this.userInfoUrl, { headers: userInfoHeaders });

      //가져온 사용자 ID가 여러분의 사용자 ID와 일치하는지 확인합니다.
      const userId = data.id; // Kakao API가 사용자 ID를 'id' 필드에 반환한다고 가정합니다.

      if (!this.validateUser(userId)) {
        throw new UnauthorizedException('유저가 유효하지 않습니다.');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('토큰의 권한이 없습니다.');
    }
  }

  private validateUser(userId): boolean {
    
    const existingUser = this.userRepo.findOne({ where: { kakaoId: userId } });
    if(existingUser){ return true; }

    return false; // 여러분의 검증 로직으로 대체하세요.
  }
}
