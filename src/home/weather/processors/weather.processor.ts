import { Injectable } from "@nestjs/common";
import { OpenWeatherProcessor } from "./openWeather.processor";
import { TodayWeatherProcessor } from "./todayWeather.processor";

@Injectable()
export class WeatherProcessor{
  constructor(
    private openWeatherProcessor: OpenWeatherProcessor,
    private todayWeatherProcessor: TodayWeatherProcessor,
  ) {}

  async currentWeather(data, lat, lon){
    return this.openWeatherProcessor.openWeatherCurrentProcessing(data, lat, lon);
  }

  async weekWeather(data, lat, lon){
    return this.openWeatherProcessor.openWeatherWeekProcessing(data, lat, lon);
  }

  async todayWeather(data, lat, lon){
    return this.todayWeatherProcessor.todayProcessing(data, lat, lon);
  }
}