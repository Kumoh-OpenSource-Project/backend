import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/weather.processor';
@Injectable()
export class HomeService {
  constructor(
    private homeWeatherService:WeatherService,
    private weatherProcessor:WeatherProcessor,
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
