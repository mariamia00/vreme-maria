import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  WeatherData: any;
  city: string = 'Groenland';
  forecastData: any;
  isDay!: boolean;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // *---- display local weather by default --------
    this.getForecastData(this.city);

    // ---- rest of original code ------------------
    this.WeatherData = {
      main: {},
      isDay: true,
    };
    this.getWeatherData();
    console.log(this.WeatherData);
  }

  // * ------- Maria's code for forecast
  getForecastData(city: string) {
    this.weatherService.getForecast(city).subscribe((data) => {
      this.forecastData = data;
    });
  }

  getWeatherIcon(forecast: any): string {
    switch (forecast.weather[0].main.toLowerCase()) {
      case 'clear':
        return 'fa-sun';
      case 'clouds':
        return 'fa-cloud';
      case 'rain':
        return 'fa-cloud-showers-heavy';
      default:
        return 'fa-sun'; // Default icon for unknown conditions
    }
  }
  getWeatherIconColor(forecast: any): string {
    switch (forecast.weather[0].main.toLowerCase()) {
      case 'clear':
        return 'yellow';
      case 'clouds':
        return 'white';
      case 'rain':
        return 'navy';
      default:
        return 'white';
    }
  }

  groupForecastsByDay(): any[] {
    const groupedForecasts = [];
    const datesSet = new Set();

    for (const forecast of this.forecastData.list) {
      const date = forecast.dt_txt.split(' ')[0]; // Extract date without time
      if (!datesSet.has(date)) {
        groupedForecasts.push(forecast);
        datesSet.add(date);
      }
    }

    return groupedForecasts;
  }

  // !#################################
  // ---- weather just for one day
  getWeatherData() {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=Targu Jiu, RO&appid=63fdce08f5b8339ef0c50c1e9e914dc5'
    )
      .then((response) => response.json())
      .then((data) => {
        this.setWeatherData(data);
      });
  }

  setWeatherData(data: any) {
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = currentDate.getTime() < sunsetTime.getTime();
    this.WeatherData.temp_celcius = (
      this.WeatherData.main.temp - 273.15
    ).toFixed(0);
    this.WeatherData.temp_min = (
      this.WeatherData.main.temp_min - 273.15
    ).toFixed(0);
    this.WeatherData.temp_max = (
      this.WeatherData.main.temp_max - 273.15
    ).toFixed(0);
    this.WeatherData.temp_feels_like = (
      this.WeatherData.main.feels_like - 273.15
    ).toFixed(0);
  }

  calculatePrecipitationPercentage(rain1h: number, snow1h: number): number {
    const thresholdMM = 5;

    const totalPrecipitationInMM = rain1h + snow1h;

    // Calculate precipitation percentage
    const percentage = (totalPrecipitationInMM / thresholdMM) * 100;

    // Ensure the percentage is capped at 100%
    return percentage > 100 ? 100 : percentage;
  }
}
