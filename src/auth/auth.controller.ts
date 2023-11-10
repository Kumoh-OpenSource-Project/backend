import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';


const KAKAO_API_KEY = '67eaf7aba63516865d34444b8ef7e966'
const CODE_REDIRECT_URI='http://localhost:3000/auth/kakao'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('/')
    @Header('Content-Type', 'text/html')
    async kakaoRedirect(
        @Res() res
        ): Promise<void> 
    {
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=67eaf7aba63516865d34444b8ef7e966&redirect_uri=http://localhost:3000/auth/kakao`;
        res.redirect(url);
    }

    @Get('kakao')
    async getKakaoInfo(@Query() query: { code }) {
      const apikey = KAKAO_API_KEY;
      const redirectUri = CODE_REDIRECT_URI;
      await this.authService.kakaoLogin(apikey, redirectUri, query.code);
    }


}
