import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
export type Category = { id: number; name: string };
@Injectable({
  providedIn: 'root',
})

export class CategoryService {
  private auth = inject(AuthService);
  private URL_BASE = 'https://w370351.ferozo.com/api';

  async getCategoriesByUser(userId: number | string): Promise<Category[]> {
    const res = await fetch(`${this.URL_BASE}/users/${userId}/categories`, {
      headers: {
        ...this.auth.getAuthorizationHeader(),
      },
    });

    if (!res.ok) throw new Error('No se pudieron cargar las categorías');
    return (await res.json()) as Category[];
}
}
