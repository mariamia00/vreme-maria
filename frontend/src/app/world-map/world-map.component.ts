import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css'],
})
export class WorldMapComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}
  map!: L.Map;
  searchCity!: string;

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([44.4268, 26.1025], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap',
    }).addTo(this.map);

    // Fetch weather data for a city (e.g., New York)
    this.weatherService.getWeather('Targu Jiu').subscribe((data: any) => {
      const temperature = data.main.temp.toFixed(0);
      const color = this.getColorForTemperature(temperature);

      // Add a marker for New York with the fetched temperature
      L.marker([data.coord.lat, data.coord.lon], {
        icon: L.divIcon({
          className: 'temperature-marker',
          html: `<div style="width:60px; padding:5px; border-radius:2px; background-color: ${color};">${temperature}&deg;C</div>`,
        }),
      }).addTo(this.map);
    });
  }

  getColorForTemperature(temp: number) {
    if (temp < 10) {
      return 'lightskyblue';
    } else if (temp >= 10 && temp <= 20) {
      return 'lime';
    } else if (temp > 20 && temp <= 28) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  searchForCity() {
    this.weatherService.getWeather(this.searchCity).subscribe((data: any) => {
      const temperature = data.main.temp.toFixed(0);
      const color = this.getColorForTemperature(temperature);

      this.map.setView([data.coord.lat, data.coord.lon], 10);

      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });

      // Add a marker for the searched city with the fetched temperature
      L.marker([data.coord.lat, data.coord.lon], {
        icon: L.divIcon({
          className: 'temperature-marker',
          html: `<div style="width:60px; padding:5px; background-color: ${color};">${temperature}&deg;C</div>`,
        }),
      }).addTo(this.map);
    });
  }
}
