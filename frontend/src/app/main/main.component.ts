import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  people: any[] = [];
  newPerson: any = { name: '', age: 0, job: '' };
  serverUrl = environment.production
    ? 'https://crazyweather.onrender.com'
    : 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPeople();
  }

  fetchPeople() {
    const fullUrl = `${this.serverUrl}/api/people`;
    this.http.get(`${fullUrl}`).subscribe((data: any) => {
      this.people = data;
    });
  }

  addPerson() {
    const fullUrl = `${this.serverUrl}/api/people`;
    this.http.post(`${fullUrl}`, this.newPerson).subscribe(() => {
      this.fetchPeople();
    });
  }

  deletePerson(_id: string) {
    const apiUrl = `/api/people/${_id}`;
    const fullUrl = `${this.serverUrl}${apiUrl}`;
    this.http.delete(`${fullUrl}`).subscribe(() => {
      this.fetchPeople();
    });
  }
}
