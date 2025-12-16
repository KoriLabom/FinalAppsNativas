import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  authService = inject(AuthService);

  readonly URL_BASE = "https://w370351.ferozo.com/api";

  products: any[] = [];
  
  /** Obtiene los productos del usuario (dueño) => del restaurante */
  async getProductsByUser(userId: string | number) {
    const res = await fetch(`${this.URL_BASE}/users/${userId}/products`, {
      headers:{
          Authorization: "Bearer "+this.authService.token,
        }
    });

    if (!res.ok) return;

    const resJson = await res.json();
    this.products = resJson;
  }

  async getProductsByCategory(categoryId: string | number) {
    const res = await fetch(`${this.URL_BASE}/products/me?categoryId=${categoryId}`, {
      headers:{
          ...this.authService.getAuthorizationHeader(),
        }
    });
    if (!res.ok) return;

    const resJson = await res.json();
    this.products = resJson;
  }

  /** Borra un producto */
  async deleteProduct(productId: string) {
    

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No vas a poder revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    
    if (result.isConfirmed) {
        const token = this.authService.token;
      const res = await fetch(`${this.URL_BASE}/products/${productId}`, {
        method: "DELETE",
        headers:{
          Authorization: "Bearer "+token,
        }
      });

      if (!res.ok) {
        await Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el producto.",
          icon: "error"
        });
        return false;
      }

      this.products = this.products.filter(p => p.id !== productId);

      await Swal.fire({
        title: "Eliminado",
        text: "El producto fue eliminado correctamente.",
        icon: "success"
      });

      return true;
    } else {
      await Swal.fire({
        title: "Cancelado",
        text: "El producto no fue eliminado.",
        icon: "info"
      });
      return false;
    }
  }
  /** Obtiene un producto del usuario por ID (para editar) */
async getProductById(productId: string | undefined) {
  const res = await fetch(`${this.URL_BASE}/products/${productId}`, {
    headers: {
      Authorization: "Bearer " + this.authService.token,
    }
  });
  if (!res.ok) return;
  const product = await res.json();
  return product;
}

/** Crea un producto */
async createProduct(newProduct: any) {
  const res = await fetch(`${this.URL_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.token,
    },
    body: JSON.stringify(newProduct)
  });
  if (!res.ok) return;

  const created = await res.json();
  this.products.push(created);
  return created;
}

/** Edita un producto */
async editProduct(productEdited: any, productId?: string) {
  console.log("EDITANDO PRODUCTO:", JSON.stringify(productEdited), "ID:", productId);
  const res = await fetch(`${this.URL_BASE}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.token,
    },
    body: JSON.stringify(productEdited)
  });
  if (!res.ok) return;

  this.products = this.products.map(p => {
    if (p.id === productEdited.id) return productEdited;
    return p;
  });

  return productEdited;
}

}
