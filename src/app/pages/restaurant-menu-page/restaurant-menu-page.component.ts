import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RestaurantService, Restaurant, MenuProduct } from '../../services/restaurant.service';
import { CategoryService, Category } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

type GroupedCategory = { id: number | string; name: string; items: MenuProduct[] };

@Component({
  selector: 'app-restaurant-menu-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-menu-page.component.html',
  styleUrl: './restaurant-menu-page.component.scss',
})
export class RestaurantMenuPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);

  private categoryService = inject(CategoryService);
  private productsService = inject(ProductService);
  private authService = inject(AuthService);

  isLoading = true;
  errorMsg: string | null = null;

  restaurant: Restaurant | null = null;

  products: MenuProduct[] = [];
  grouped: GroupedCategory[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Falta el id del restaurante en la URL.';
      this.isLoading = false;
      return;
    }

    this.loadRestaurantAndMenu(id);
  }

  private async loadRestaurantAndMenu(id: string) {
    this.isLoading = true;
    this.errorMsg = null;

    try {
      const r = await new Promise<Restaurant>((resolve, reject) => {
        this.restaurantService.getRestaurantById(id).subscribe({
          next: resolve,
          error: reject,
        });
      });
      this.restaurant = r;

      const userId = this.authService.userId; // ajustá si se llama distinto
      const categories = await this.categoryService.getCategoriesByUser(userId);

      const grouped: GroupedCategory[] = [];
      let allProducts: MenuProduct[] = [];

      for (const c of categories) {
        const items = await this.productsService.getProductsByCategory(c.id);
        const safeItems = (items ?? []) as MenuProduct[];

        grouped.push({
          id: c.id,
          name: c.name,
          items: safeItems.slice().sort((a, b) =>
            String(a.name ?? '').localeCompare(String(b.name ?? ''))
          ),
        });

        allProducts = allProducts.concat(safeItems);
      }

      this.grouped = grouped.filter(g => g.items.length > 0); // si querés mostrar categorías vacías, sacá este filter
      this.products = allProducts;

      this.isLoading = false;
    } catch (err) {
      console.error(err);
      this.errorMsg = 'No se pudo cargar el menú/categorías.';
      this.isLoading = false;
    }
  }

  isFeatured(p: MenuProduct): boolean {
    return !!(p.isFeatured ?? (p as any).featured);
  }

  discount(p: MenuProduct): number {
    return Number(p.discountPercentage ?? (p as any).discount ?? 0);
  }

  hasHappyHour(p: MenuProduct): boolean {
    return !!(p.happyHourEnabled ?? (p as any).hasHappyHour);
  }

  finalPrice(p: MenuProduct): number {
    const price = Number(p.price ?? 0);
    const d = this.discount(p);
    if (!d) return price;
    return Math.round(price * (1 - d / 100));
  }

  trackCategory = (_: number, c: GroupedCategory) => c.id;
  trackProduct = (_: number, p: MenuProduct) => (p as any).id;
}
