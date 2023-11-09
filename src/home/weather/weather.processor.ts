import { Injectable } from "@nestjs/common";
import { CurrentWeatherDto } from "../../common/dto/home/current-weather.dto";
import { WeekOneDayWeatherDto, WeekWeatherDto } from "../../common/dto/home/week-weather.dto";
import { SunMoonAPI } from "./api/sun-moon.api";
import { parseISO } from "date-fns";
import { AstroAPI } from "./api/astro.api";
import { format } from 'date-fns';
import { TodayTimeDto, TodayWeatehrDto } from "../../common/dto/home/today-weather.dto";

@Injectable()
export class WeatherProcessor{
  constructor(
    private sunMoonApi: SunMoonAPI,
    private astroApi: AstroAPI,
  ) {}

  private today = format(new Date(), 'yyyy-MM-dd');
  
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
    weather.seeing = await this.astroApi.getCurrentSeeing(lat, lon);
    return weather;
  }

  async openWeatherWeekProcessing(data, lat, lon){
    let result = data.list.reduce((map, item) =>
    {
      let date = item.dt_txt.split(" ")[0];
      let time = item.dt_txt.split(" ")[1].substring(0, 5);

      if(date === this.today){
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

    let weekWeathers: WeekWeatherDto[] = Object.values(result);
    weekWeathers = await this.openWeatherWeekDayProcessing(weekWeathers, lat, lon);
    weekWeathers = await this.weekSeeing(weekWeathers, lat, lon);
    return weekWeathers;
  }

  async todayProcessing(data, lat, lon){
    const weather = new TodayWeatehrDto();
    const {sunrise, sunset, moonrise, moonset} = await this.sunMoonApi.getSunMoon(lat, lon, this.today);
    weather.sunrise = sunrise;
    weather.sunset = sunset;
    weather.moonrise = moonrise;
    weather.moonset = moonset;

    weather.weathers = data.reduce((acc, cur) => {
        if (['T1H', 'REH', 'SKY', 'PTY'].includes(cur.category)) {
            let timeObject = acc.find(item => item.fcstTime === cur.fcstTime);

            if (!timeObject) {
                timeObject = new TodayTimeDto();
                timeObject.fcstTime = cur.fcstTime;
                acc.push(timeObject);
            }

            if(cur.category === 'T1H'){
              timeObject.temp = cur.fcstValue;
            }
            else if(cur.category === 'REH'){
              timeObject.humidity = cur.fcstValue;
            }
            else{
              timeObject.icon = this.getIcon(cur.fcstValue, cur.category) + this.getDayOrNight(cur.fcstTime);
            }
        }
        return acc;
    }, []);
    return weather;
  
  }

  getIcon(value, type){
    let icons = ['01', '02', '03', '04', '09', '10', '11', '13', '50'];

    if (type === 'SKY'){
      return icons[value - 1];
    } else{
      if(value === 1){
        return icons[5];
      }else if(value === 2){
        return icons[3];
      }else if(value === 3){
        return icons[7];
      }else if(value === 5){
        return icons[4];
      }else if(value === 6){
        return icons[8];
      }else if(value === 7){
        return icons[7];
      }
    }
  }

  getDayOrNight(timeStr) {
    const hour = parseInt(timeStr.substring(0, 2), 10);
    if (hour >= 18 || hour < 6) {
        return 'n';
    } else {
        return 'd';
    }
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
      const {sunrise, sunset, moonrise, moonset} = await this.sunMoonApi.getSunMoon(lat, lon, day.date);
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

  async todayWeather(data, lat, lon){
    return this.todayProcessing(data, lat, lon);
  }
}