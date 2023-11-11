import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepo : Repository<User>,
    ) {
    super({
      clientID: configService.get<string>('KAKAO_API_KEY'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }
  async validate(accessToken, refreshToken, profile, done) {
    const { _raw, _json, ...profileRest } = profile;
    const properties = _.mapKeys(_json.properties, (v, k) => {
      return _.camelCase(k);
    });

    const searchedUser = await this.userRepo.findOne({ where: {kakaoId: _json.id} });
    
    if(searchedUser){
      const payload = {
        serviceId: searchedUser.id,
        profile: profileRest,
        properties,
        token: {
          accessToken,
          refreshToken,
        },
      };
      done(null, payload)
    }else{
      const makedUser = this.userRepo.create({
        name: _json.properties.nickname,
        nickName: _json.properties.nickname,
        level: "수성",
        kakaoId: _json.id,
      });
      const savedUser = await this.userRepo.save(makedUser);
  
      const payload = {
        serviceId: savedUser.id,
        profile: profileRest,
        properties,
        token: {
          accessToken,
          refreshToken,
        },
      };
      done(null, payload);
      }
    }

    
}
