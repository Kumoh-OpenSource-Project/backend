

export class WeekWeatherDto{
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  seeing: string;
  lunAge: number;
  weathers: WeekOneDayWeatherDto[]
}

export class WeekOneDayWeatherDto{
  main: string;
  description: string;
  icon: string;
  temp: number;
  time: string;
}