import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { AstroAPI } from './weather/api/astro.api';
import { UserAuthGuard } from 'src/guard/user.auth.guard';

// @UseGuards(UserAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService, private astroAPI:AstroAPI) {}

  @Get()
  async getWeather(@Query('type') type: string, @Query('lat') lat: number, @Query('lon') lon:number){
    return await this.homeService.getWeather(type, lat, lon);
  }

  @Get('/astro')
  async getAstro(){
    return await this.astroAPI.getWeekSeeing(36.14578, 128.39394);
  }

}
