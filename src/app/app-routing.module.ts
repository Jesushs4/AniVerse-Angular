import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainPage } from './pages/main/main.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    component: MainPage, // Este componente tiene <router-outlet>
    children: [
      {
        path: 'main',
        loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'library',
        loadChildren: () => import('./pages/library/library.module').then(m => m.LibraryPageModule),
      },
      // ... otras rutas
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
