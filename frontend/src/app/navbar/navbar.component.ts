import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user!: User;

  isNavbarOpen: boolean = false;

  constructor(private userService: UserService) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return this.user.token;
  }
}
