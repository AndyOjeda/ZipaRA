import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';

import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ScanComponent } from './pages/scan/scan.component';
import { Modelos3dComponent } from './pages/modelos3d/modelos3d.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'scan', component: ScanComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'modelo3d', component: Modelos3dComponent },
];
