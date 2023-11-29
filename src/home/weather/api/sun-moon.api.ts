import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { format } from 'date-fns';
import { Dayjs } from "dayjs";
import { MoonAgeDto } from "src/common/dto/home/moon-age.dto";
@Injectable()
export class SunMoonAPI{
  private readonly SUNMOON_URL = process.env.SUNMOON_URL;
  private readonly SUNMOON_KEY = process.env.SUNMOON_KEY;
  private readonly MOONAGE_URL = process.env.MOONAGE_URL;

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
      return error;
    }

  }

  async getMoonAgeByMonth(year: string, mon: string){
    const url = `${this.MOONAGE_URL}?numOfRows=31&serviceKey=${this.SUNMOON_KEY}&solYear=${year}&solMonth=${mon}`;
    console.log(`getMoonAgeByMonth: ${url}`);
    try{
      let response = (await axios.get(url)).data.response.body.items.item;
      let moonAges: MoonAgeDto[] = [];
      response.forEach(item => {
          let moonAge = new MoonAgeDto();
          moonAge.lunAge = Math.floor(item.lunAge);
          moonAge.solDay = item.solDay.toString();
          moonAges.push(moonAge);
      });
      return moonAges;
      
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async getMoonAgeByDay(year, mon, day){

    const url = `${this.MOONAGE_URL}?serviceKey=${this.SUNMOON_KEY}&solYear=${year}&solMonth=${mon}&solDay=${day}`;
    console.log(`getMoonAgeByDay: ${url}`)
    try{
      let response = (await axios.get(url)).data.response.body.items.item.lunAge;
      return Math.floor(response);
      
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async getMoonAgeByWeek(year, mon, day){
    const url = `${this.MOONAGE_URL}?numOfRows=31&serviceKey=${this.SUNMOON_KEY}&solYear=${year}&solMonth=${mon}`;
    console.log(`getMoonAgeByWeek: ${url}`)
    try{
      let response = (await axios.get(url)).data.response.body.items.item;
      console.log(`day: ${day}, ${response[day]['solDay']}`);
      let moonAges = [];
      let cnt = 0;
      let idx = day;
      while (cnt < 6) {
        if (!response[idx]){
          idx = 0;
        }
        let value = Math.floor(response[idx]['lunAge'])
        moonAges.push(value);
        idx++;
        cnt++;
      }
      return moonAges;
      
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  convertToAMPM(time) {
    if (isNaN(Number(time))) {
      return '--:--';
    }
    let date = new Date(1970, 0, 1, time.substring(0, 2), time.substring(2));
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

}