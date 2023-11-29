import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherProcessor } from './processors/weather.processor';
import { CoordinateTransition } from './api/coordinate.transition';
import { format } from 'date-fns';

@Injectable()
export class WeatherService {
  constructor(
    private weatherProcessor:WeatherProcessor,
    private coordinateTransition: CoordinateTransition,
  ){}

  private readonly OPENWEATHER_URL = process.env.OPENWEATHER_URL;
  private readonly OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  private readonly DATAGO_URL = process.env.DATAGO_URL;
  private readonly DATAGO_KEY = process.env.DATAGO_WEATHER_KEY;

  async getCurrentTime(){
    const today = new Date();
    const baseDate = format(today, 'yyyyMMdd');
    let currentTime;
    if (today.getHours() === 0) {
      currentTime = 0
    } else {
        currentTime = today.getHours() - 1;
    }
    return {baseDate, baseTime: await this.formatNumber(currentTime)}
  }

  async formatNumber(number) {
    let str = number.toString().padStart(2, '0');
    str += '00';
    return str;
  }

  async getOpenWeather(type: string, lat: number, lon: number){
    const url = `${this.OPENWEATHER_URL}/${type}?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${this.OPENWEATHER_KEY}`;
    try{
      const response = await axios.get(url);
      if(!response.data['list']){
        return this.weatherProcessor.currentWeather(response.data, lat, lon);
      }
      else{
        return this.weatherProcessor.weekWeather(response.data, lat, lon);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getTodayWeather(lat: number, lon: number){
    const {x, y} = this.coordinateTransition.lamcproj(lon, lat);
    console.log(`coords : ${x}, ${y}`);
    const {baseDate, baseTime} =await this.getCurrentTime();
    const url = `${this.DATAGO_URL}&serviceKey=${this.DATAGO_KEY}&base_date=${baseDate}&base_time=${baseTime}&nx=${x}&ny=${y}`;
    console.log(url)

    try{
      const response = (await axios.get(url)).data.response.body.items.item;
      return this.weatherProcessor.todayWeather(response, lat, lon);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  
}
