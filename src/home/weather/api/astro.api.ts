import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AstroAPI{

  private readonly ASTRO_URL = process.env.ASTRO_URL;
  private readonly ASTRO_CURRENT = process.env.ASTRO_CURRENT;
  private readonly ASTRO_WEEK = process.env.ASTRO_WEEK;
  

  getIndex(){
    const baseTimes = [3, 6, 9, 15, 18, 21, 24];
    const today = new Date();
    const currentTime = today.getHours();
    let closestTime = baseTimes[baseTimes.length - 1];
    
    for (let i = 0; i < baseTimes.length; i++) {
      if (currentTime >= baseTimes[i]) {
        closestTime = baseTimes[i];
      } else {
        break;
      }
    }
    const idx = closestTime - (3 + (2* (closestTime/3 - 1)));
    return idx;
  }

  getSeeings(weather){
    if (weather.includes("clear")) {
      return 1;
    } else if (weather.includes("pcloudy")) {
        return 2;
    } else if (weather.includes("mcloudy")) {
        return 5;
    } else if (weather.includes("cloudy")) {
        return 7;
    } else if (weather.includes("humid")) {
        return 3;
    } else if (weather.includes("lightrain")) {
        return 8;
    } else if (weather.includes("oshower")) {
        return 6;
    } else if (weather.includes("ishower")) {
        return 4;
    } else if (weather.includes("snow")) {
        return 8;
    } else {
        return 0;
    }
  }

  async getCurrentSeeing(lat: number, lon: number){
    const url = `${this.ASTRO_URL}&product=${this.ASTRO_CURRENT}&lat=${lat}&lon=${lon}`;

    try{
      const response = (await axios.get(url)).data.dataseries;
      const idx = this.getIndex();
      return response[idx].seeing;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getWeekSeeing(lat: number, lon: number){
    const url = `${this.ASTRO_URL}&product=${this.ASTRO_WEEK}&lat=${lat}&lon=${lon}`;
    const timePoints = [4, 12, 20, 28, 36];
    let seeings = [];

    try{
      const response = (await axios.get(url)).data.dataseries;
      for (let i = 0; i < 5; i++) {
        let idx = timePoints[i];
        seeings.push(this.getSeeings(response[idx].weather))
      }
      return seeings;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

}