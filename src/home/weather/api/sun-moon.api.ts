import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { format } from 'date-fns';
@Injectable()
export class SunMoonAPI{
  private readonly SUNMOON_URL = process.env.SUNMOON_URL;
  private readonly SUNMOON_KEY = process.env.SUNMOON_KEY;


  async getSunMoon(lat: number, lon: number, date: string){
    const locdate = date.replace(/-/g, "")
    const url = `${this.SUNMOON_URL}&serviceKey=${this.SUNMOON_KEY}&locdate=${locdate}&longitude=${lon}&latitude=${lat}`;
    
    try{
      const response = (await axios.get(url)).data.response.body.items.item;
      const sunrise = this.convertToAMPM(response.sunrise);
      const sunset = this.convertToAMPM(response.sunset);
      const moonrise = this.convertToAMPM(response.moonrise);
      const moonset = this.convertToAMPM(response.moonset);
      return await {sunrise, sunset, moonrise, moonset};

    } catch (error) {
      console.log(error);
    }

  }

  convertToAMPM(time) {
    let date = new Date(1970, 0, 1, time.substring(0, 2), time.substring(2));
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}