import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherProcessor } from './weather.processor';
import { CoordinateTransition } from './coordinate.transition';
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
  private readonly DATAGO_KEY = process.env.DATAGO_WEATEHR_KEY;

  getCurrentTime(){
    const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];
    const today = new Date();
    const baseDate = format(today, 'yyyyMMdd');
    const currentTime = today.getHours();
    let closestTime = baseTimes[baseTimes.length - 1];
    
    for (let i = 0; i < baseTimes.length; i++) {
      if (currentTime > baseTimes[i]) {
        closestTime = baseTimes[i];
      } else {
        break;
      }
    }
    return {baseDate, baseTime: this.formatNumber(closestTime)}
  }

  formatNumber(number) {
    let str = number.toString().padStart(2, '0');
    str += '00';
    return str;
  }

  async getOpenWeather(type: string, lat: number, lon: number){
    const url = `${this.OPENWEATHER_URL}/${type}?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${this.OPENWEATHER_KEY}`;
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

  async getTodayWeather(lat: number, lon: number){
    const types = 'pageNo=1&numOfRows=700&dataType=JSON'
    const {x, y} = await this.coordinateTransition.lamcproj(lon, lat);
    const {baseDate, baseTime} = this.getCurrentTime();
    const url = `${this.DATAGO_URL}?serviceKey=${this.DATAGO_KEY}&${types}&base_date=${baseDate}&base_time=${baseTime}&nx=${x}&ny=${y}`;
    console.log(url)

    try{
      const response = await axios.get(url);
      // return this.weatherProcessor.todayWeather(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  
}
