import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService, Restaurant, MenuProduct } from '../../services/restaurant.service';

@Component({
  selector: 'app-product-detail-public-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);

  isLoading = true;
  errorMsg: string | null = null;

  restaurantId: string | null = null;
  productId: string | null = null;

  restaurant: Restaurant | null = null;
  product: MenuProduct | null = null;

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId');
    this.productId = this.route.snapshot.paramMap.get('productId');

    if (!this.restaurantId || !this.productId) {
      this.errorMsg = 'Faltan parámetros en la URL.';
      this.isLoading = false;
      return;
    }

    this.loadData(this.restaurantId, this.productId);
  }

  private loadData(restaurantId: string, productId: string) {
    this.isLoading = true;
    this.errorMsg = null;

    // 1) restaurante
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (r) => {
        this.restaurant = r;

        // 2) menú del restaurante, y de ahí saco el producto por id
        this.restaurantService.getMenuByRestaurantId(restaurantId).subscribe({
          next: (items) => {
            const list = items ?? [];
            const found = list.find(p => String(p.id) === String(productId));

            if (!found) {
              this.errorMsg = 'No se encontró el producto en este restaurante.';
              this.product = null;
            } else {
              this.product = found;
            }

            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMsg = 'No se pudo cargar el menú del restaurante.';
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo cargar la info del restaurante.';
        this.isLoading = false;
      },
    });
  }

  // helpers compat con tu API
  isFeatured(p: MenuProduct): boolean {
    return !!(p.isFeatured ?? p.featured);
  }

  discount(p: MenuProduct): number {
    return Number(p.discountPercentage ?? p.discount ?? 0);
  }

  hasHappyHour(p: MenuProduct): boolean {
    return !!(p.happyHourEnabled ?? p.hasHappyHour);
  }

  finalPrice(p: MenuProduct): number {
    const price = Number(p.price ?? 0);
    const d = this.discount(p);
    if (!d) return price;
    return Math.round(price * (1 - d / 100));
  }
}
