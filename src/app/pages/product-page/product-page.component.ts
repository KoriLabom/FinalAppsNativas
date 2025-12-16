import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  authService = inject(AuthService);
  productsService = inject(ProductService);
  router = inject(Router);

  isLoading = true;

  // UI state
  q = '';
  onlyFeatured = false;
  onlyHappyHour = false;

  ngOnInit(): void {
    this.reload();
  }

  async reload() {
    this.isLoading = true;

    const userId = this.authService.userId;
    if (!userId) {
      this.isLoading = false;
      return;
    }

    await this.productsService.getProductsByUser(userId);
    this.isLoading = false;
  }

  // helpers de compatibilidad con tu API (featured/isFeatured, discount/discountPercentage, etc)
  isFeatured(p: any): boolean {
    return !!(p.isFeatured ?? p.featured);
  }

  hasHappyHour(p: any): boolean {
    return !!(p.happyHourEnabled ?? p.hasHappyHour);
  }

  discount(p: any): number {
    return Number(p.discountPercentage ?? p.discount ?? 0);
  }

  finalPrice(p: any): number {
    const price = Number(p.price ?? 0);
    const d = this.discount(p);
    if (!d) return price;
    return Math.round(price * (1 - d / 100));
  }

  get filtered() {
    const text = this.q.trim().toLowerCase();

    return (this.productsService.products ?? []).filter((p) => {
      const name = String(p.name ?? '').toLowerCase();
      const desc = String(p.description ?? '').toLowerCase();
      const cat = String(p.categoryName ?? '').toLowerCase();

      const matchesText =
        !text || name.includes(text) || desc.includes(text) || cat.includes(text);

      const matchesFeatured = !this.onlyFeatured || this.isFeatured(p);
      const matchesHH = !this.onlyHappyHour || this.hasHappyHour(p);

      return matchesText && matchesFeatured && matchesHH;
    });
  }

  createProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(id: string | number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  async deleteProduct(id: string) {
    await this.productsService.deleteProduct(id);
  }
}
