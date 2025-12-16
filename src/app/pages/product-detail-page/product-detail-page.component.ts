import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  productsService = inject(ProductService);

  isLoading = true;
  errorMsg: string | null = null;

  productId: string | null = null;
  product: any = null;

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (!this.productId) {
      this.errorMsg = 'Falta el id del producto en la URL.';
      this.isLoading = false;
      return;
    }

    await this.reload();
  }

  async reload() {
    if (!this.productId) return;

    this.isLoading = true;
    this.errorMsg = null;

    try {
      const p = await this.productsService.getProductById(this.productId);
      if (!p) {
        this.errorMsg = 'No se encontró el producto.';
        this.product = null;
      } else {
        this.product = p;
      }
    } catch (e) {
      console.error(e);
      this.errorMsg = 'Error al cargar el producto.';
      this.product = null;
    } finally {
      this.isLoading = false;
    }
  }

  // helpers para compatibilidad con tu API (isFeatured/featured, discount/discountPercentage, etc.)
  isFeatured(): boolean {
    return !!(this.product?.isFeatured ?? this.product?.featured);
  }

  discount(): number {
    return Number(this.product?.discountPercentage ?? this.product?.discount ?? 0);
  }

  hasHappyHour(): boolean {
    return !!(this.product?.happyHourEnabled ?? this.product?.hasHappyHour);
  }

  finalPrice(): number {
    const price = Number(this.product?.price ?? 0);
    const d = this.discount();
    if (!d) return price;
    return Math.round(price * (1 - d / 100));
  }

  edit() {
    if (!this.productId) return;
    this.router.navigate(['/admin/products/edit', this.productId]);
  }

  async delete() {
    if (!this.productId) return;

    const ok = await this.productsService.deleteProduct(this.productId);
    if (ok) this.router.navigate(['/admin/products']);
  }

  back() {
    this.router.navigate(['/admin/products']);
  }
}
