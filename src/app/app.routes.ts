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


// import { authGuard } from './guards/auth.guard';
// import { ownerGuard } from './guards/owner.guard';
// import { onlyGuestGuard } from './guards/only-guest.guard';

export const routes: Routes = [
    

    // Auth
    {
        path: "login",
        component: LoginPageComponent,
        // canActivate: [onlyGuestGuard]
    },
    {
        path: "register",
        component: RegisterPageComponent,
        // canActivate: [onlyGuestGuard]
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
                path: 'restaurantes/:id',
                component: RestaurantDetailComponent 
            },
            {
                path: "restaurants",
                component: RestaurantsPageComponent
            },
            {
                path: "restaurants/:id",
                component: RestaurantMenuPageComponent
            },
            {
                path: "products/:id",
                component: ProductDetailPageComponent
            },

            // Cuenta (usuario logueado)


            // Admin (dueño)
            {
                path: "admin/products",
                component: ProductsAdminPageComponent,
                // canActivate: [authGuard, ownerGuard]
            },
            {
                path: "admin/products/new",
                component: ProductFormPageComponent,
                // canActivate: [authGuard, ownerGuard]
            },
            {
                path: "admin/products/edit/:id",
                component: ProductFormPageComponent,
                // canActivate: [authGuard, ownerGuard]
            },
            {
                path: "admin/categories",
                component: CategoriesAdminPageComponent,
                // canActivate: [authGuard, ownerGuard]
            },
            {
                path: "admin/categories/new",
                component: CategoryFormPageComponent,
                // canActivate: [authGuard, ownerGuard]
            },
            {
                path: "admin/categories/edit/:id",
                component: CategoryFormPageComponent,
                // canActivate: [authGuard, ownerGuard]
            }

        ]
    }

];
