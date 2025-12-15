import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-form-page',
  imports: [FormsModule],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.scss',
})
export class ProductFormPageComponent implements OnInit {
  private categoriesService = inject(CategoryService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  productsService = inject(ProductService);
  authservice = inject(AuthService);
  userId: string | null = this.authservice.userId;
  

  productId: string | undefined = undefined;
  isEdit = false;
  categories: any[] = [];
  // Ajustá campos según tu API
  form: any = {
    name: '',
    description: '',
    price: 0,
    categoryId: null,
    featured: false,
    labels: [
      "none"
    ],
    recommendedFor: 0,
    discount: 0,
    hasHappyHour: false
  };

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') ?? undefined;
    
    this.isEdit = !!this.productId;
    
    this.categories = await this.categoriesService.getCategoriesByUser(this.userId!);

    if (this.isEdit) {
      const product = await this.productsService.getProductById(this.productId!);
      if (!product) return;
      this.productId = product.id; // ✅ guardo el id para el PUT
      // Cargamos el form
      this.form = {
  ...this.form,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  categoryId: Number(product.categoryId),
  featured: !!(product.featured ?? product.isFeatured),
  labels: product.labels ?? [],
  recommendedFor: Number(product.recommendedFor ?? product.recomendedFor ?? 0),
  discount: Number(product.discount ?? 0),
  hasHappyHour: !!product.hasHappyHour,
};

      console.log("FORM EN EDIT:", this.form);
      console.log("PRODUCTO CARGADO:",product.name,
  "description:", product.description,
  "price:", product.price,
  "categoryId:", Number(product.categoryId),
  "featured:", !!(product.featured ?? product.isFeatured),
  "labels:", product.labels ?? [],
  "recommendedFor:", Number(product.recommendedFor ?? product.recomendedFor ?? 0),
  "discount:", Number(product.discount ?? 0),
  "hasHappyHour:", !!product.hasHappyHour,);
    }
  }

  async save() {
    if (!this.userId) return;
    
    // Validación mínima
    if (!this.form.name || this.form.price == null) return;

    if (this.isEdit) {
      await this.productsService.editProduct(this.form, this.productId);
    } else {
      await this.productsService.createProduct(this.form);
    }

    this.router.navigate(['/admin/products']);
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
