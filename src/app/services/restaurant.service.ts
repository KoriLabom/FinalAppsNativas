import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private apiUrl = 'https://w370351.ferozo.com/api/users';

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);
  }

  // ✅ nuevo: restaurante por id
  getRestaurantById(id: number | string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
  }

  // ✅ nuevo: menú del restaurante (productos del usuario)
  getMenuByRestaurantId(id: number | string): Observable<MenuProduct[]> {
    return this.http.get<MenuProduct[]>(`${this.apiUrl}/${id}/products`);
  }
}
