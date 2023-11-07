import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherProcessor } from './weather.processor';
import { CoordinateTransition } from './coordinate.transition';
import { format } from 'date-fns';
import { CoordinateDto } from './coordinate.dto';

@Injectable()
export class WeatherService {
  constructor(
    private weatherProcessor:WeatherProcessor,
    private coordinateTransition: CoordinateTransition,
  ){}

  private readonly OPENWEATHER_API = process.env.OPENWEATHER_URL;
  private readonly OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  private readonly DATAGO_API = process.env.DATAGO_API;
  private readonly DATAGO_KEY = process.env.DATAGO_WEATEHR_KEY;

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

  async getTodayWeather(lat: number, lon: number){
    const types = 'pageNo=1&numOfRows=700&dataType=JSON'
    const dto = new CoordinateDto();
    dto.lon = lon;
    dto.lat = lat;
    const coords = await this.coordinateTransition.convertCoordinate(dto);
    // const coords = await this.coordinateTransition.lamcproj(lon, lat, 0, 0, 0);
    const nx = coords['x'];
    const ny = coords['y'];

    console.log(coords);
    const today = new Date();
    const baseDate = format(today, 'yyyyMMdd');
    // const baseTime = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
    const baseTime = '1400';

    const url = `${this.DATAGO_API}?serviceKey=${this.DATAGO_KEY}&${types}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
    console.log(url)
    try{
      const response = await axios.get(url);
      console.log(response.data.response.body.items);
      // return this.weatherProcessor.todayWeather(response.data);

    } catch (error) {
      console.log(error);
    }

  }
}
