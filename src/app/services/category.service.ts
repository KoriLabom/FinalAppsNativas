import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

export type Category = { id: number; name: string };

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private auth = inject(AuthService);
  private URL_BASE = 'https://w370351.ferozo.com/api';

  categories: Category[] = [];

  /** Lista categorías del usuario */
  async getCategoriesByUser(userId: string|null): Promise<Category[]> {
    const res = await fetch(`${this.URL_BASE}/users/${userId}/categories`, {
      headers: {
        ...this.auth.getAuthorizationHeader(),
      },
    });

    if (!res.ok) throw new Error('No se pudieron cargar las categorías');

    const data = (await res.json()) as Category[];
    this.categories = data;
    return data;
  }


  /** Crea una categoría */
  async createCategory(newCategory: Omit<Category, 'id'>): Promise<Category | undefined> {
    const res = await fetch(`${this.URL_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.auth.getAuthorizationHeader(),
      },
      body: JSON.stringify(newCategory),
    });

    if (!res.ok) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo crear la categoría.',
        icon: 'error',
      });
      return undefined;
    }

    const created = (await res.json()) as Category;
    this.categories.push(created);

    await Swal.fire({
      title: 'Creada',
      text: 'La categoría se creó correctamente.',
      icon: 'success',
    });

    return created;
  }

  /** Edita una categoría */
  async editCategory(categoryEdited: Category, categoryId?: string | number): Promise<Category | undefined> {
    const id = categoryId ?? categoryEdited.id;

    const res = await fetch(`${this.URL_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.auth.getAuthorizationHeader(),
      },
      body: JSON.stringify(categoryEdited),
    });

    if (!res.ok) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo editar la categoría.',
        icon: 'error',
      });
      return undefined;
    }

    // Si tu API devuelve la categoría actualizada, podés usarla:
    // const updated = (await res.json()) as Category;
    // Acá dejo fallback: usamos lo que mandaste
    const updated = categoryEdited;

    this.categories = this.categories.map(c => (c.id === updated.id ? updated : c));

    await Swal.fire({
      title: 'Actualizada',
      text: 'La categoría se editó correctamente.',
      icon: 'success',
    });

    return updated;
  }

  /** Borra una categoría */
  async deleteCategory(categoryId: string | number): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No vas a poder revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      await Swal.fire({
        title: 'Cancelado',
        text: 'La categoría no fue eliminada.',
        icon: 'info',
      });
      return false;
    }

    const res = await fetch(`${this.URL_BASE}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        ...this.auth.getAuthorizationHeader(),
      },
    });

    if (!res.ok) {
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar la categoría.',
        icon: 'error',
      });
      return false;
    }

    this.categories = this.categories.filter(c => c.id !== Number(categoryId));

    await Swal.fire({
      title: 'Eliminada',
      text: 'La categoría fue eliminada correctamente.',
      icon: 'success',
    });

    return true;
  }
}
