import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {

    async kakaoLogin(apikey: string, redirectUri: string, code: string) {
        const config = {
          grant_type: 'authorization_code',
          client_id: apikey,
          redirect_uri: redirectUri,
          code,
        };
        const params = new URLSearchParams(config).toString();
          const tokenHeaders = {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        };
        const tokenUrl = `https://kauth.kakao.com/oauth/token?`  

        await axios.post(tokenUrl, params, { headers: tokenHeaders }).then(async (res) => {
            console.log(res.data);
            const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
            const userInfoHeaders = {
              Authorization: `Bearer ${res.data.access_token}`,
            };
            const { data }  = await axios.get(userInfoUrl, {headers: userInfoHeaders})
            console.log(data.id);
        });

        

      }

}
