import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserLogin } from '../interfaces/UserLogin';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../constants/urls';
import { UserRegister } from '../interfaces/UserRegister';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: UserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Hello, ${user.name}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error('Login Failed');
        },
      })
    );
  }

  register(userRegiser: UserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the Foodmine ${user.name}`,
            'Register Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error('Register Failed');
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }

  getUserName(userId: string): Observable<string> {
    return this.http.get<string>(`/api/user/${userId}/name`);
  }
}
