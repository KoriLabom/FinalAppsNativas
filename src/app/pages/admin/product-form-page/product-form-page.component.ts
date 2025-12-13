import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form-page',
  imports: [FormsModule],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.scss',
})
export class ProductFormPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productsService = inject(ProductService);

  userId: string | null = localStorage.getItem("userId");

  productId: string | null = null;
  isEdit = false;

  // Ajustá campos según tu API
  form: any = {
    name: '',
    description: '',
    price: 0,
    categoryId: null,
    imageUrl: '',
    isFeatured: false,
  };

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;

    if (!this.userId) return;

    if (this.isEdit) {
      const product = await this.productsService.getProductById(this.userId, this.productId!);
      if (!product) return;

      // Cargamos el form
      this.form = {
        ...this.form,
        ...product
      };
    }
  }

  async save() {
    if (!this.userId) return;

    // Validación mínima
    if (!this.form.name || this.form.price == null) return;

    if (this.isEdit) {
      await this.productsService.editProduct(this.userId, this.form);
    } else {
      await this.productsService.createProduct(this.userId, this.form);
    }

    this.router.navigate(['/admin/products']);
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
