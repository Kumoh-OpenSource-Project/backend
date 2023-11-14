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
  
  async canActivate(context: ExecutionContext) { 
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization'];

    if (!accessToken) {
      throw new UnauthorizedException('엑세스 토큰이 없습니다. 다시 로그인하여 주십시오');
    }

    try {
      const userInfoHeaders = {
        Authorization: accessToken,
      };

      const { data } = await axios.get(this.userInfoUrl, { headers: userInfoHeaders });
      const userId = data.id; 

      if (!this.validateUser(userId)) {
        throw new UnauthorizedException('유저가 유효하지 않습니다.');
      }
      
      return userId;
    
    } catch (error) {
      throw new UnauthorizedException('토큰의 권한이 없습니다.');
    }
  }

  private validateUser(userId): boolean {
    const existingUser = this.userRepo.findOne({ where: { kakaoId: userId } });
    if(existingUser){ return true; }
    return false;
  }
}
