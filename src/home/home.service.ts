import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HomeWeatherService } from './home.weather.service';
@Injectable()
export class HomeService {
  constructor(
    private homeWeatherService:HomeWeatherService,
  ){}

  async getWeather(type: string, lat: number, lon: number){
    if (type === 'current'){
      return this.homeWeatherService.getOpenWeather('weather', lat, lon);
    }
    else if(type === 'week'){
      return this.homeWeatherService.getOpenWeather('forecast', lat, lon);
    }
  }
}
