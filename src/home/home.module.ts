import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/processors/weather.processor';
import { CoordinateTransition } from './weather/api/coordinate.transition';
import { SunMoonAPI } from './weather/api/sun-moon.api';
import { AstroAPI } from './weather/api/astro.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { OpenWeatherProcessor } from './weather/processors/openWeather.processor';
import { TodayWeatherProcessor } from './weather/processors/todayWeather.processor';
import { EventsService } from './event.service';
import { Events } from 'src/entities/Events';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Events
    ]),
  ],
  controllers: [HomeController],
  providers: [
    HomeService,
    WeatherService,
    EventsService,
    WeatherProcessor,
    OpenWeatherProcessor,
    TodayWeatherProcessor,
    CoordinateTransition,
    SunMoonAPI,
    AstroAPI],
})
export class HomeModule {}
