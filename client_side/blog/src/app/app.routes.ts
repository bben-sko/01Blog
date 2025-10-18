import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './home/home';
import { NewPost } from './newpost/newpost';
import { Profile } from './profile/profile';
import { UsersList } from './shered/add-user/users-list';

export const routes: Routes = [

    {path : "login" , component: Login},
    {path : "" , component: Home},
    {path : "register" , component: Register},
    { path: 'newpost', component: NewPost },  
    {path: 'adduser', component: UsersList},
    {path: 'profile/:username', component: Profile},
    {path : "**" , redirectTo : ""},
];
