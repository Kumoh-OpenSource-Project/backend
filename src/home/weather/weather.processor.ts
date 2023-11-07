import { Injectable } from "@nestjs/common";
import { CurrentWeatherDto } from "./current-weather.dto";
import { format } from 'date-fns';

@Injectable()
export class WeatherProcessor{
  constructor() {}

  async currentWeather(data){
    const current = new CurrentWeatherDto();
    current.main = data['weather'][0]['main'];
    current.description = data['weather'][0]['description'];
    current.icon = data['weather'][0]['icon'];
    current.temp = data['main']['temp'];
    current.feelsLike = data['main']['feels_like'];
    current.tempMin = data['main']['temp_min'];
    current.tempMax = data['main']['temp_max'];
    current.humidity = data['main']['humidity'];
    current.windSpeed = data['wind']['speed'];
    current.windDeg = data['wind']['deg'];
    current.clouds = data['clouds']['all'];
    current.sunrise = this.timeFormatting(data['sys']['sunrise']);
    current.sunset = this.timeFormatting(data['sys']['sunset']);

    console.log(current);

    return current;
  }

  timeFormatting(timestamp: number){
    const date = new Date(timestamp * 1000);
    return format(date, 'yyyy MM-dd HH:mm:ss');
  }
}