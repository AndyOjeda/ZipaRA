import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';

import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ScanComponent } from './pages/scan/scan.component';
import { Modelos3dComponent } from './pages/modelos3d/modelos3d.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SetupPreferenciesComponent } from './pages/IA/setup-preferencies/setup-preferencies.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'preferencias', component: SetupPreferenciesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'scan', component: ScanComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'detail/:category/:id', component: DetailComponent },
  { path: 'modelo3d', component: Modelos3dComponent },
];
