import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [

    {
        path: "login",
        component: LoginPageComponent,
        //canActivate: [onlyGuestGuard]
    },
    {
        path: "register",
        component: RegisterPageComponent,
        //canActivate: [onlyGuestGuard]
    },
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "home",
                component: HomePageComponent
            },
        ]
        
    }

];
