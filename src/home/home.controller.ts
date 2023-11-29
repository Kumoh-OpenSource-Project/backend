import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { SunMoonAPI } from './weather/api/sun-moon.api';
import { YearPipe } from 'src/common/year.pipe';

// @UseGuards(UserAuthGuard)
@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService, 
    private moonAPI: SunMoonAPI,
    ) {}

  @Get()
  async getWeather(@Query('type') type: string, @Query('lat') lat: number, @Query('lon') lon:number){
    return await this.homeService.getWeather(type, lat, lon);
  }

  @Get('/moon')
  async getMoonAge(@Query('year', new YearPipe()) year: string, @Query('month') mon: string){
    return await this.moonAPI.getMoonAgeByMonth(year, mon);
  }

}
