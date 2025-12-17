import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-form-page',
  imports: [FormsModule],
  templateUrl: './category-form-page.component.html',
  styleUrl: './category-form-page.component.scss',
})
export class CategoryFormPageComponent implements OnInit {
  private categoriesService = inject(CategoryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId: string | undefined = undefined;
  isEdit = false;

  // form simple
  form: Partial<Category> = {
    name: '',
  };

  async ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? undefined;
    
    this.isEdit = !!this.categoryId;

    if (!this.isEdit) return;

    const userId = this.authService.userId;
    if (!userId) {
      // si no hay sesión, volvés a login o a categories
      this.router.navigate(['/login']);
      return;
    }

    // Traemos todas las categorías del usuario y buscamos la que coincide
    const categories = await this.categoriesService.getCategoriesByUser(userId);

    const found = categories.find(c => String(c.id) === String(this.categoryId));
    if (!found) {
      // si no existe esa categoría, volvemos al listado
      this.router.navigate(['/admin/categories']);
      return;
    }

    // cargamos form
    this.form = {
      id: found.id,
      name: found.name,
    };
  }

  async save() {
    if (!this.form.name || !this.form.name.trim()) return;

    if (this.isEdit) {
      await this.categoriesService.editCategory(
        { id: Number(this.categoryId), name: this.form.name.trim() } as Category,
        this.categoryId
      );
    } else {
      await this.categoriesService.createCategory({
        name: this.form.name.trim(),
      } as Category);
    }

    this.router.navigate(['/admin/categories']);
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
