import { Injectable } from "@nestjs/common";
import { CurrentWeatherDto } from "./current-weather.dto";
import { format } from 'date-fns';
import { WeekWeatherDto } from "./week-weather.dto";

@Injectable()
export class WeatherProcessor{
  constructor() {}
  
  openWeatherProcessing(data){
    const weather = new CurrentWeatherDto();
    weather.main = data['weather'][0]['main'];
    weather.description = data['weather'][0]['description'];
    weather.icon = data['weather'][0]['icon'];
    weather.temp = data['main']['temp'];
    weather.feelsLike = data['main']['feels_like'];
    weather.tempMin = data['main']['temp_min'];
    weather.tempMax = data['main']['temp_max'];
    weather.humidity = data['main']['humidity'];
    weather.windSpeed = data['wind']['speed'];
    weather.windDeg = data['wind']['deg'];
    weather.clouds = data['clouds']['all'];

    return weather;
  }

  timestampFormatting(timestamp: number){
    const date = new Date(timestamp * 1000);
    return format(date, 'yyyy MM-dd HH:mm:ss');
  }

  async currentWeather(data){
    const current = this.openWeatherProcessing(data);
    current.sunrise = this.timestampFormatting(data['sys']['sunrise']);
    current.sunset = this.timestampFormatting(data['sys']['sunset']);

    return current;
  }

  async weekWeather(data){
    const week = new WeekWeatherDto();
    week.weathers = data['list'].map((data) => {
      const weather = this.openWeatherProcessing(data);
      weather.date = data['dt_txt'];
      // weather.sunrise = ??
      // weather.sunset = ??
      return weather;
    });

    return week.weathers;
  }


}