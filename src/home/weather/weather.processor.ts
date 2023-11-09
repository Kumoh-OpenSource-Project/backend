import { Injectable } from "@nestjs/common";
import { CurrentWeatherDto } from "./current-weather.dto";
import { WeekOneDayWeatherDto, WeekWeatherDto } from "./week-weather.dto";
import { SunMoonAPI } from "./sun-moon.api";
import { parseISO } from "date-fns";
import { AstroAPI } from "./astro/astro.api";
import { format } from 'date-fns';

@Injectable()
export class WeatherProcessor{
  constructor(
    private sunMoonApi: SunMoonAPI,
    private astroApi: AstroAPI,
  ) {}
  
  async openWeatherCurrentProcessing(data, lat, lon){
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

    const {sunrise, sunset, moonrise, moonset} = await this.sunMoonApi.getSunMoon(lat, lon);
    weather.sunrise = sunrise;
    weather.sunset = sunset;
    weather.moonrise = moonrise;
    weather.moonset = moonset;
    weather.seeing = await this.astroApi.getCurrentSeeing(lat, lon);
    return weather;
  }

  async openWeatherWeekProcessing(data, lat, lon){
    let today = format(new Date(), 'yyyy-MM-dd');

    let resultMap = data.list.reduce((map, item) =>
    {
      let date = item.dt_txt.split(" ")[0];
      let time = item.dt_txt.split(" ")[1].substring(0, 5);

      if(date === today){
        return map;
      }

      if (!map[date]) {
          let day = new WeekWeatherDto();
          day.date = date;
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
    weekWeathers = await this.openWeatherWeekDayProcessing(weekWeathers, lat, lon);
    weekWeathers = await this.weekSeeing(weekWeathers, lat, lon);
    return weekWeathers;
  }

  async weekSeeing(weekWeathers, lat, lon){
    const seeings = await this.astroApi.getWeekSeeing(lat, lon);
    for(let i = 0; i < weekWeathers.length; i++) {
    weekWeathers[i].seeing = seeings[i];
    }
    return weekWeathers;
  }

  async openWeatherWeekDayProcessing(weekWeathers, lat, lon){
    weekWeathers = await Promise.all(weekWeathers.map(async day => {
      const {sunrise, sunset, moonrise, moonset} = await this.sunMoonApi.getSunMoon(lat, lon, parseISO(day.date));
      day.sunrise = sunrise;
      day.sunset = sunset;
      day.moonrise = moonrise;
      day.moonset = moonset;
      return day;
    }));
    return weekWeathers;
  }

  async currentWeather(data, lat, lon){
    const current = this.openWeatherCurrentProcessing(data, lat, lon);
    return current;
  }

  async weekWeather(data, lat, lon){
    const weekWeathers = this.openWeatherWeekProcessing(data, lat, lon);
    return weekWeathers;
  }
}