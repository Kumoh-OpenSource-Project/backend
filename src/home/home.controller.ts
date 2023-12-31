import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { SunMoonAPI } from './weather/api/sun-moon.api';
import { YearPipe } from 'src/common/year.pipe';
import { EventsService } from './event.service';
import { PositiveCoordinate } from 'src/common/decorator/latlon.decorator';

@UseGuards(UserAuthGuard)
@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService, 
    private readonly eventService: EventsService,
    private moonAPI: SunMoonAPI,
    ) {}

  @Get()
  async getWeather(@Query('type') type: string, @PositiveCoordinate() coordinates){
    const { lat, lon } = coordinates;
    if(type === 'event'){
      return await this.eventService.getEventDDay();
    }
    else{
      return await this.homeService.getWeather(type, lat, lon);
    }
  }

  @Get('/moon')
  async getMoonAge(@Query('year', new YearPipe()) year: string, @Query('month') mon: string){
    return await this.moonAPI.getMoonAgeByMonth(year, mon);
  }

}
