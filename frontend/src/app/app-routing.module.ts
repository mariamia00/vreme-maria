import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { UywComponent } from './uyw/uyw.component';
import { ContactComponent } from './contact/contact.component';
import { ReadmoreComponent } from './about/readmore/readmore.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'worldmap', component: WorldMapComponent },
  { path: 'uyw', component: UywComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
