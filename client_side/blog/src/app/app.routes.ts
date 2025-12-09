import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './home/home';
import { NewPost } from './newpost/newpost';
import { Profile } from './profile/profile';
import { UsersList } from './shered/add-user/users-list';
import { Singlepost } from './singlepost/singlepost';
import { Admin } from './admin/admin';
import { Notification } from './notification/notification';
import { adminGuard } from './guards/admin.guard';
import { TokenGuard } from './guards/validtoken.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Home, canActivate: [TokenGuard] },
  { path: 'register', component: Register },
  { path: 'newpost', component: NewPost, canActivate: [TokenGuard] },
  { path: 'adduser', component: UsersList, canActivate: [TokenGuard] },
  { path: 'post/:id', component: Singlepost, canActivate: [TokenGuard] },
  {
    path: 'profile/:username',
    component: Profile
    , canActivate: [TokenGuard]  
  },
{
  path: 'admin',
    component: Admin,
    canActivate: [adminGuard]
  },
  {
    path: 'notification',
    component: Notification
    , canActivate: [TokenGuard]
  },
  { path: '**', redirectTo: '' },
];
