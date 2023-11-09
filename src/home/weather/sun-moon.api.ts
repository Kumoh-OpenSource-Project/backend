import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { format } from 'date-fns';
@Injectable()
export class SunMoonAPI{
  private readonly SUNMOON_URL = process.env.SUNMOON_URL;
  private readonly SUNMOON_KEY = process.env.SUNMOON_KEY;


  async getSunMoon(lat: number, lon: number, date=new Date()){
    const locdate = format(date, 'yyyyMMdd');
    const url = `${this.SUNMOON_URL}&serviceKey=${this.SUNMOON_KEY}&locdate=${locdate}&longitude=${lon}&latitude=${lat}`;
    
    try{
      const response = (await axios.get(url)).data.response.body.items.item;
      const sunrise = this.formattingTime(response.sunrise);
      const sunset = this.formattingTime(response.sunset);
      const moonrise = this.formattingTime(response.moonrise);
      const moonset = this.formattingTime(response.moonset);
      return await {sunrise, sunset, moonrise, moonset};

    } catch (error) {
      console.log(error);
    }

  }

  formattingTime(time){
    return time.slice(0, 2) + ':' + time.slice(2)
  }
}