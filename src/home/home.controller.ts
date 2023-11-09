import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { AstroAPI } from './weather/astro/astro.api';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService, private astroAPI:AstroAPI) {}

  @Get()
  async getWeather(@Query('type') type: string, @Query('lat') lat: number, @Query('lon') lon:number){
    // console.log(lat, lon);
    return await this.homeService.getWeather(type, lat, lon);
  }

  @Get('/astro')
  async getAstro(){
    return await this.astroAPI.getWeekSeeing(36.14578, 128.39394);
  }

}
