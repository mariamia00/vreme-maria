import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  WeatherData: any;
  city: string = 'Targu Jiu';
  forecastData: any;
  isDay!: boolean;

  constructor(
    private weatherService: WeatherService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // *---- display local weather by default --------
    this.getForecastData(this.city);

    // ---- rest of original code ------------------
    this.WeatherData = {
      main: {},
      isDay: true,
    };
    this.weatherService.getWeatherTGJIU(this.city).subscribe((data: any) => {
      this.setWeatherData(data);
    });
  }

  convertWindSpeed(speedMS: number): number {
    const speedKMH = speedMS * 3.6;
    return parseFloat(speedKMH.toFixed(1));
  }

  // * ------- Maria's code for forecast
  getForecastData(city: string) {
    this.weatherService.getForecast(city).subscribe(
      (data) => {
        this.forecastData = data;
      },
      (error) => {
        console.error(error);
        this.toastr.error('City not found');
      }
    );
  }

  getWindDirection(deg: number): string {
    if (deg >= 337.5 || deg < 22.5) return 'North';
    if (deg >= 22.5 && deg < 67.5) return 'Northeast';
    if (deg >= 67.5 && deg < 112.5) return 'East';
    if (deg >= 112.5 && deg < 157.5) return 'Southeast';
    if (deg >= 157.5 && deg < 202.5) return 'South';
    if (deg >= 202.5 && deg < 247.5) return 'Southwest';
    if (deg >= 247.5 && deg < 292.5) return 'West';
    return 'Northwest';
  }

  getWeatherIcon(forecast: any): string {
    switch (forecast.weather[0].main.toLowerCase()) {
      case 'clear':
        return 'fa-sun';
      case 'clouds':
        return 'fa-cloud';
      case 'rain':
        return 'fa-cloud-showers-heavy';
      case 'snow':
        return 'fa-snowflake';
      default:
        return 'fa-question-mark'; // Default icon for unknown conditions
    }
  }
  getWeatherIconColor(forecast: any): string {
    switch (forecast.weather[0].main.toLowerCase()) {
      case 'clear':
        return 'yellow';
      case 'clouds':
        return 'white';
      case 'rain':
        return 'grey';
      default:
        return 'white';
    }
  }
  getPressureCategory(pressure: number): string {
    if (pressure > 1013) {
      return 'high';
    } else if (pressure < 1013) {
      return 'low';
    } else {
      return 'moderate';
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

  setWeatherData(data: any) {
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = currentDate.getTime() < sunsetTime.getTime();
    this.WeatherData.temp_celcius = (data.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (data.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (data.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (data.main.feels_like - 273.15).toFixed(
      0
    );
    this.WeatherData.precipitation = data.rain ? data.rain['1h'] : 0; // Assuming 1h precipitation is available
  }

  calcPrecipitationTGJIU(data: any): {
    precipitation: number;
    chanceOfPrecipitation: number;
  } {
    let totalPrecipitation = 0;
    let chanceOfPrecipitation = 0;

    if (data.rain && data.rain['1h']) {
      totalPrecipitation += data.rain['1h'];
      chanceOfPrecipitation = 100; // 100% chance when it's raining
    }

    if (data.snow && data.snow['1h']) {
      totalPrecipitation += data.snow['1h'];
      chanceOfPrecipitation = 100; // 100% chance when it's snowing
    }

    return { precipitation: totalPrecipitation, chanceOfPrecipitation };
  }

  calcPercentForecast(forecast: any): number {
    const thresholdMM = 5;

    const rain1h =
      forecast.rain && forecast.rain['3h'] ? forecast.rain['3h'] : 0;

    // Calculate precipitation percentage
    const percentage = (rain1h / thresholdMM) * 100;

    // Ensure the percentage is capped at 100%
    return percentage > 100 ? 100 : percentage;
  }
}
