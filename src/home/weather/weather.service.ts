import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherProcessor } from './weather.processor';

@Injectable()
export class WeatherService {
  constructor(
    private weatherProcessor:WeatherProcessor,
  ){}

  private readonly OPENWEATHER_API = process.env.OPENWEATHER_URL;
  private readonly OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  async getOpenWeather(type: string, lat: number, lon: number){
    const url = `${this.OPENWEATHER_API}/${type}?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${this.OPENWEATHER_KEY}`;

    try{
      const response = await axios.get(url);

      if(!response.data['list']){
        return this.weatherProcessor.currentWeather(response.data);
      }
      else{
        return this.weatherProcessor.weekWeather(response.data);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}