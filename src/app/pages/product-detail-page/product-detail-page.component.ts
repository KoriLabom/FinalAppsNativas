import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service'; // 👈 ajustá si tu path es otro
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);

  productsService = inject(ProductService);
  authService = inject(AuthService);

  isLoading = true;
  errorMsg: string | null = null;

  productId: string | undefined = undefined;

  // lo guardo ya “normalizado” para el html
  product: any = null;

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (!this.productId) {
      this.errorMsg = 'Falta el id del producto en la URL.';
      this.isLoading = false;
      return;
    }

    await this.loadProduct(this.productId);
  }

  async loadProduct(id: string) {
    this.isLoading = true;
    this.errorMsg = null;

    try {
      const product = await this.productsService.getProductById(id);

      if (!product) {
        this.errorMsg = 'No se encontró el producto.';
        this.product = null;
        return;
      }

      // ✅ Normalización igual que tu form (compat API)
      this.product = {
        ...product,
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryId: Number(product.categoryId),
        categoryName: product.categoryName,
        featured: !!(product.featured ?? product.isFeatured),
        labels: product.labels ?? [],
        recommendedFor: Number(product.recommendedFor ?? product.recomendedFor ?? 0),
        discount: Number(product.discount ?? product.discountPercentage ?? 0),
        hasHappyHour: !!(product.hasHappyHour ?? product.happyHourEnabled),
      };
    } catch (e) {
      console.error(e);
      this.errorMsg = 'Error al cargar el producto.';
      this.product = null;
    } finally {
      this.isLoading = false;
    }
  }

  finalPrice(): number {
    const price = Number(this.product?.price ?? 0);
    const d = Number(this.product?.discount ?? 0);
    if (!d) return price;
    return Math.round(price * (1 - d / 100));
  }

  back() {
    // si querés volver al admin:
    this.router.navigate(['/admin/products']);

    // si querés volver a la vista pública (si la tenés), cambiá esto.
    // this.router.navigate(['/restaurants']);
  }
}
