import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { id } from 'date-fns/locale';
import { UserInfoDto } from 'src/common/dto/user/user.dto';
import { UserAllInfoDto } from 'src/common/dto/user/userAllInfo.dto';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ){}
  private readonly userInfoUrl = process.env.KAKAO_USERINFO_URI
    
  async checkToken(req: Request){
        const accessToken = req.headers['authorization'];

        if (!accessToken) {
            throw new UnauthorizedException('엑세스 토큰이 없습니다. 다시 로그인하여 주십시오');
          }

          try{
            const userInfoHeaders = {
                Authorization: accessToken,
              };
        
              const { data } = await axios.get(this.userInfoUrl, { headers: userInfoHeaders });
              

              const userId = data.id; 
              const existingUser = await this.userRepo.findOne({ where: { kakaoId: userId } });

              if(!existingUser){
                    const makedUser = this.userRepo.create({
                      name: data.properties.nickname,
                      nickName: data.properties.nickname,
                      level: "수성",
                      kakaoId: data.id,
                      profilePhoto: `""fh`
                    });
                
                await this.userRepo.save(makedUser);
                return makedUser;
              }

              return existingUser ; 

        
          }catch(error){
            throw new BadRequestException([error]);
          }
    }

}
