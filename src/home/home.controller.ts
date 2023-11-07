import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getWeather(@Query('type') type: string, @Query('lat') lat: number, @Query('lon') lon:number){
    // console.log(lat, lon);
    return await this.homeService.getWeather(type, lat, lon);
  }
}
