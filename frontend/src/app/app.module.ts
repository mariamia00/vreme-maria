import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { UywComponent } from './uyw/uyw.component';
import { ContactComponent } from './contact/contact.component';
import { ReadmoreComponent } from './about/readmore/readmore.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthInterceptor } from './guard/auth.interceptor';
import { FooterComponent } from './footer/footer.component';

const routes: Routes = [{ path: 'readmore', component: ReadmoreComponent }];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    WorldMapComponent,
    UywComponent,
    ContactComponent,
    ReadmoreComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    LeafletModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      newestOnTop: false,
    }),
  ],
  exports: [RouterModule],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
