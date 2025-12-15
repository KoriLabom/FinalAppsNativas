import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-category-form-page',
  imports: [FormsModule],
  templateUrl: './category-form-page.component.html',
  styleUrl: './category-form-page.component.scss',
})
export class CategoryFormPageComponent implements OnInit {
  private categoriesService = inject(CategoryService);
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

    if (this.isEdit) {
      const category = await this.categoriesService.getCategoryById(this.categoryId!);
      if (!category) return;

      // cargamos form
      this.form = {
        id: category.id,
        name: category.name,
      };
    }
  }

  async save() {
    // Validación mínima
    if (!this.form.name || !this.form.name.trim()) return;

    if (this.isEdit) {
      await this.categoriesService.editCategory(
        { id: Number(this.categoryId), name: this.form.name.trim() } as Category,
        this.categoryId
      );
    } else {
      await this.categoriesService.createCategory({
        name: this.form.name.trim(),
      });
    }

    this.router.navigate(['/admin/categories']);
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
