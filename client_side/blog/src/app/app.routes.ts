import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './home/home';
import { UsersList } from './add-user/add-user';
import { NewPost } from './newpost/newpost';
import { Profile } from './profile/profile';

export const routes: Routes = [

    {path : "login" , component: Login},
    {path : "" , component: Home},
    {path : "register" , component: Register},
    { path: 'newpost', component: NewPost },  
    {path: 'adduser', component: UsersList},
    {path: 'profile', component: Profile},
    {path : "**" , redirectTo : ""},
];
