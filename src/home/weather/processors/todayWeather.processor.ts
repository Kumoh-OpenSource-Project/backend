import { Injectable } from "@nestjs/common";
import { SunMoonAPI } from "../api/sun-moon.api";
import { format } from 'date-fns';
import { TodayTimeDto, TodayWeatehrDto } from "src/common/dto/home/today-weather.dto";


@Injectable()
export class TodayWeatherProcessor{
  constructor(
    private sunMoonApi: SunMoonAPI,
  ) {}
  
  private today = format(new Date(), 'yyyy-MM-dd');

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
}