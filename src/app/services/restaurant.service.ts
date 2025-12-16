import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';

export interface Restaurant {
  id: number;
  restaurantName: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

export type MenuProduct = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  categoryName?: string;
  isFeatured?: boolean;
  featured?: boolean;
  discountPercentage?: number;
  discount?: number;
  happyHourEnabled?: boolean;
  hasHappyHour?: boolean;
};

const DEMO_RESTAURANTS: Restaurant[] = [
  { id: 1, restaurantName: 'La Trattoria', password: '', firstName: 'Juan', lastName: 'Pérez', address: 'Mendoza 1234, Rosario', phoneNumber: '+54 341 555-1111' },
  { id: 2, restaurantName: 'Sushi Nube', password: '', firstName: 'Meli', lastName: 'Gómez', address: 'Oroño 890, Rosario', phoneNumber: '+54 341 555-2222' },
  { id: 3, restaurantName: 'Burgers & Co', password: '', firstName: 'Mateo', lastName: 'Labombarda', address: 'Pellegrini 2200, Rosario', phoneNumber: '+54 341 555-3333' },
];

const DEMO_MENU: Record<number, MenuProduct[]> = {
  1: [
    { id: 101, name: 'Tarta de tomate', description: 'Con albahaca y oliva', price: 5200, categoryName: 'Entradas', isFeatured: true, discount: 10, hasHappyHour: true },
    { id: 102, name: 'Pasta casera', description: 'Salsa bolognesa', price: 7800, categoryName: 'Platos principales' },
  ],
  2: [
    { id: 201, name: 'California Roll', description: 'Palta y surimi', price: 6900, categoryName: 'Rolls', discountPercentage: 15 },
    { id: 202, name: 'Nigiri salmón', description: '2 unidades', price: 4200, categoryName: 'Nigiri', happyHourEnabled: true },
  ],
  3: [
    { id: 301, name: 'Cheese Burger', description: 'Doble cheddar', price: 6500, categoryName: 'Burgers', featured: true },
    { id: 302, name: 'Papas con cheddar', description: 'Extra crocantes', price: 3900, categoryName: 'Acompañamientos' },
  ],
};

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private apiUrl = 'https://w370351.ferozo.com/api/users';

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    if (environment.demo) return of(DEMO_RESTAURANTS).pipe(delay(300));

    return this.http.get<Restaurant[]>(this.apiUrl).pipe(
      catchError(() => of(DEMO_RESTAURANTS).pipe(delay(300)))
    );
  }

  getRestaurantById(id: number | string): Observable<Restaurant> {
    if (environment.demo) {
      const found = DEMO_RESTAURANTS.find(r => r.id === Number(id));
      return of(found as Restaurant).pipe(delay(250));
    }

    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = DEMO_RESTAURANTS.find(r => r.id === Number(id));
        return of(found as Restaurant).pipe(delay(250));
      })
    );
  }

  getMenuByRestaurantId(id: number | string): Observable<MenuProduct[]> {
    if (environment.demo) return of(DEMO_MENU[Number(id)] ?? []).pipe(delay(250));

    return this.http.get<MenuProduct[]>(`${this.apiUrl}/${id}/products`).pipe(
      catchError(() => of(DEMO_MENU[Number(id)] ?? []).pipe(delay(250)))
    );
  }
}
