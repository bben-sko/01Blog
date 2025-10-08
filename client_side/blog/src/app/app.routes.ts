import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
// import { Dashboard } from './features/dashboard/dashboard';
// import { Home } from './features/home/home';

export const routes: Routes = [
  // Home route
//   { path: '', component: Home },
  
  // Auth routes
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Dashboard route
//   { path: 'dashboard', component: Dashboard },
  
//   // Routes with parameters
//   { path: 'post/:id', component: PostDetail },
  
//   // Redirect
//   { path: 'signin', redirectTo: '/login', pathMatch: 'full' },
  
//   // Wildcard route (404)
//   { path: '**', redirectTo: '/' }
];
