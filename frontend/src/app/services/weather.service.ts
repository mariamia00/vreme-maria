import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'f8f4e525ed37ffda6cf76bb2cf1dbd7d';
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getForecast(city: string): Observable<any> {
    const url = `${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  getWeather(city: string): Observable<any> {
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric',
    };

    return this.http.get(`${this.apiUrl}/weather`, { params });
  }

  // -----another code for default to match original code

  getDefaultWeather(city: string): Observable<any> {
    const params = {
      q: city,
      appid: this.apiKey,
    };

    return this.http.get(`${this.apiUrl}/weather`, { params });
  }

  getWeatherTGJIU(city: string): Observable<any> {
    return this.getDefaultWeather(city);
  }
}
