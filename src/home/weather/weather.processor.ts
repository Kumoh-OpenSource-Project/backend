import { Injectable } from "@nestjs/common";
import { CurrentWeatherDto } from "./current-weather.dto";
import { format } from 'date-fns';
import { WeekOneDayWeatherDto, WeekWeatherDto } from "./week-weather.dto";

@Injectable()
export class WeatherProcessor{
  constructor() {}
  
  openWeatherCurrentProcessing(data){
    const weather = new CurrentWeatherDto();
    weather.main = data.weather[0].main;
    weather.description = data.weather[0].description;
    weather.icon = data.weather[0].icon;
    weather.temp = data.main.temp;
    weather.feelsLike = data.main.feels_like;
    weather.tempMin = data.main.temp_min;
    weather.tempMax = data.main.temp_max;
    weather.humidity = data.main.humidity;
    weather.windSpeed = data.wind.speed;
    weather.windDeg = data.wind.deg;
    weather.sunrise = this.timestampFormatting(data.sys.sunrise);
    weather.sunset = this.timestampFormatting(data.sys.sunset);
    weather.moonrise = "";
    weather.moonset = "";
    weather.seeing = "";
    return weather;
  }

  openWeatherWeekProcessing(data){
    let resultMap = data.list.reduce((map, item) =>
    {
      let date = item.dt_txt.split(" ")[0];
      let time = item.dt_txt.split(" ")[1].substring(0, 5);

      if (!map[date]) {
          let day = new WeekWeatherDto();
          day.date = date;
          day.sunrise = "";
          day.sunset = "";
          day.moonrise = "";
          day.moonset = "";
          day.weathers = [];
          map[date] = day;
      }

      let weather = new WeekOneDayWeatherDto();
      weather.main = item.weather[0].main;
      weather.description = item.weather[0].description;
      weather.icon = item.weather[0].icon;
      weather.temp = item.main.temp;
      weather.time = time;

      map[date].weathers.push(weather);

      return map;
    }, {});
    let weekWeathers: WeekWeatherDto[] = Object.values(resultMap);
    return weekWeathers;
  }

  timestampFormatting(timestamp: number){
    const date = new Date(timestamp * 1000);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  async currentWeather(data){
    const current = this.openWeatherCurrentProcessing(data);
    return current;
  }

  async weekWeather(data){
    const weekWeathers = this.openWeatherWeekProcessing(data);
    return weekWeathers;
  }
}