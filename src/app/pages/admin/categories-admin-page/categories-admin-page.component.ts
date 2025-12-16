import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Category, CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories-admin-page',
  imports: [],
  templateUrl: './categories-admin-page.component.html',
  styleUrl: './categories-admin-page.component.scss',
})
export class CategoriesAdminPageComponent implements OnInit {
  authService = inject(AuthService);
  categoriesService = inject(CategoryService);
  router = inject(Router);

  categories: Category[] = [];

  ngOnInit(): void {
    this.reload();
  }

  async reload() {
    const userId = this.authService.userId;
    if (!userId) return;

    try {
      this.categories = await this.categoriesService.getCategoriesByUser(userId);
    } catch (e) {
      console.error(e);
      this.categories = [];
    }
  }

  createCategory() {
    this.router.navigate(['/admin/categories/new']);
  }

  editCategory(id: number | string) {
    this.router.navigate(['/admin/categories/edit', id]);
  }

  async deleteCategory(id: number | string) {
  const ok = await this.categoriesService.deleteCategory(id);
  if (ok) {
    // si querés recargar desde API:
    // await this.reload();
    // o si te alcanza con el update local del array, no hace falta.
    this.categories = this.categoriesService.categories;
    }
  }
  confirmarLogout(): void {
    const confirmado = confirm('¿Está seguro que quiere cerrar sesión?');

    if (confirmado) {
      this.authService.logout(); 
    }
  }

}
