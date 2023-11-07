import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HomeWeatherService {
  constructor(
  ){}

  private readonly OPENWEATHER_API = process.env.OPENWEATHER_URL;
  private readonly OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  async getOpenWeather(type: string, lat: number, lon: number){
    const url = `${this.OPENWEATHER_API}/${type}?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${this.OPENWEATHER_KEY}`;

    console.log(url)
    try{
      const response = await axios.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
