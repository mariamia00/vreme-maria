import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.userService.currentUser;

    // Check if the request URL is for the OpenWeather API or not
    if (request.url.includes('api.openweathermap.org')) {
      // If it's an OpenWeather API request, do not modify it.
      return next.handle(request);
    }

    if (user.token) {
      // For other requests, add the access token header.
      request = request.clone({
        setHeaders: {
          access_token: user.token,
        },
      });
    }

    return next.handle(request);
  }
}
