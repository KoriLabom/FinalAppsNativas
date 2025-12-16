import { Routes } from '@angular/router';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

import { LayoutComponent } from './components/layout/layout.component';


import { RestaurantsPageComponent } from './pages/restaurants-page/restaurants-page.component';
import { RestaurantMenuPageComponent } from './pages/restaurant-menu-page/restaurant-menu-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';

import { ProductsAdminPageComponent } from './pages/admin/products-admin-page/products-admin-page.component';
import { ProductFormPageComponent } from './pages/admin/product-form-page/product-form-page.component';
import { CategoriesAdminPageComponent } from './pages/admin/categories-admin-page/categories-admin-page.component';
import { CategoryFormPageComponent } from './pages/admin/category-form-page/category-form-page.component';
import { onlyGuestGuard } from './guards/onlyGuest.guard';
import { onlyUserGuard } from './guards/onlyUser.guard';
import { ProfilePageComponent } from './pages/admin/profile-page/profile-page.component';


// import { authGuard } from './guards/auth.guard';
// import { ownerGuard } from './guards/owner.guard';
// import { onlyGuestGuard } from './guards/only-guest.guard';

export const routes: Routes = [
    

    // Auth
    {
        path: "login",
        component: LoginPageComponent,
        canActivate: [onlyGuestGuard]
    },
    {
        path: "register",
        component: RegisterPageComponent,
        canActivate: [onlyGuestGuard]
    },

    // Layout wrapper
    {
        path: "",
        component: LayoutComponent,
        children: [

            {
                path: "",
                redirectTo: "restaurants",
                pathMatch: "full"
            },

            // Público
            
            {
                path: 'restaurantes/:slug',
                component: RestaurantDetailComponent, 
                canActivate: [onlyGuestGuard]
            },
            {
                path: "restaurants",
                component: RestaurantsPageComponent,
                canActivate: [onlyGuestGuard]
            },
            {
                path: "products/:id",
                component: ProductDetailPageComponent,
                canActivate: [onlyGuestGuard]
            },

            // Cuenta (usuario logueado)


            // Admin (dueño)
            {
                path: "admin/products",
                component: ProductsAdminPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/products/new",
                component: ProductFormPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/products/edit/:id",
                component: ProductFormPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/categories",
                component: CategoriesAdminPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/categories/new",
                component: CategoryFormPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/categories/edit/:id",
                component: CategoryFormPageComponent,
                canActivate: [onlyUserGuard]
            },
            {
                path: "admin/edit/profile",
                component: ProfilePageComponent,
                canActivate: [onlyUserGuard]
            }

        ]
    }

];
