import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

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

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  authService = inject(AuthService);

  readonly URL_BASE = 'https://w370351.ferozo.com/api';

  restaurants: Restaurant[] = [];

  /** Obtiene todos los restaurantes (users) */
  async getRestaurants() {
    const res = await fetch(`${this.URL_BASE}/users`, {
      headers: {
        ...this.authService.getAuthorizationHeader(),
      },
    });

    if (!res.ok) return;

    const data = (await res.json()) as Restaurant[];
    this.restaurants = data ?? [];
    return this.restaurants;
  }

  /** Obtiene restaurante por id */
  async getRestaurantById(id: number | string) {
    const res = await fetch(`${this.URL_BASE}/users/${id}`, {
      headers: {
        ...this.authService.getAuthorizationHeader(),
      },
    });

    if (!res.ok) return;

    const restaurant = (await res.json()) as Restaurant;
    return restaurant;
  }

  /** Menú del restaurante (productos del usuario/restaurante) */
  async getMenuByRestaurantId(id: number | string) {
    const res = await fetch(`${this.URL_BASE}/users/${id}/products`, {
      headers: {
        ...this.authService.getAuthorizationHeader(),
      },
    });

    if (!res.ok) return;

    const items = (await res.json()) as MenuProduct[];
    return items ?? [];
  }

  /** Editar restaurante */
  async editRestaurant(id: number | string, data: Partial<Restaurant>) {
    const res = await fetch(`${this.URL_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.authService.getAuthorizationHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return;

    const edited = (await res.json()) as Restaurant;

    // opcional: actualizar cache local si ya estaba cargado
    this.restaurants = this.restaurants.map(r => (r.id === edited.id ? edited : r));

    return edited;
  }
}
