import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/weather.processor';
@Injectable()
export class HomeService {
  constructor(
    private weatherService:WeatherService,
  ){}

  async getWeather(type: string, lat: number, lon: number){
    if (type === 'current'){
      return this.weatherService.getOpenWeather('weather', lat, lon);
    }
    else if(type === 'week'){
      return this.weatherService.getOpenWeather('forecast', lat, lon);
    }
    else if(type === 'today'){
      return this.weatherService.getTodayWeather(lat, lon);
    }
  }
}
