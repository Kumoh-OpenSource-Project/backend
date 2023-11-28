import { Controller, Get, Header, HttpStatus, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../guard/user.auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}
    
    @Get()
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {
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
    return {
      serviceId,
      id,
      username,
      accessToken,
      refreshToken,
    };
  }

  @Get('login')
  async kakaotoServerLogin(@Req() req){
    return await this.authService.checkToken(req);
  }


}
