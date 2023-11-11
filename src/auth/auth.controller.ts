import { Controller, Get, Header, HttpStatus, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from './user.auth.guard';

@Controller('auth')
export class AuthController {
    constructor( ) { }
    
    @Get()
    @UseGuards(AuthGuard('kakao'))
    kakaoLogin() {
      return HttpStatus.OK;
    }

    @UseGuards(UserAuthGuard)
    @Get('guardtest')
    hello(){
        console.log('hello');
        return 'hello';
    }

    @Get('callback')
    @UseGuards(AuthGuard('kakao'))
    kakaoLoginCallback(@Req() req) {
        const {
        user: {
            serviceId,
            profile: { id, username },
            token: { accessToken, refreshToken },
        },
        } = req;
    // 직접 JSON을 반환
    return {
      serviceId,
      id,
      username,
      accessToken,
      refreshToken,
    };
  }
}
