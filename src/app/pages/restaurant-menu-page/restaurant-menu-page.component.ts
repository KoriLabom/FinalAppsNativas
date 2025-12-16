import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { RestaurantService, Restaurant, MenuProduct } from '../../services/restaurant.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

type GroupedCategory = { id: number | string; name: string; items: MenuProduct[] };

@Component({
  selector: 'app-restaurant-menu-page',
  standalone: true,
  imports: [ RouterLink],
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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Falta el id del restaurante en la URL.';
      this.isLoading = false;
      return;
    }

    await this.loadRestaurantAndMenu(id);
  }

  private async loadRestaurantAndMenu(id: string) {
    this.isLoading = true;
    this.errorMsg = null;

    try {
      const r = await this.restaurantService.getRestaurantById(id);
      if (!r) {
        this.errorMsg = 'No se pudo cargar el restaurante.';
        this.isLoading = false;
        return;
      }
      this.restaurant = r;

      const userId = this.authService.userId;
      const categories = await this.categoryService.getCategoriesByUser(userId);

      const grouped: GroupedCategory[] = [];
      let allProducts: MenuProduct[] = [];

      for (const c of categories) {
        const items = await this.productsService.getProductsByCategory(c.id);
        const safeItems = (items ?? []) as MenuProduct[];

        grouped.push({
          id: c.id,
          name: c.name,
          items: safeItems
            .slice()
            .sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? ''))),
        });

        allProducts = allProducts.concat(safeItems);
      }

      this.grouped = grouped.filter(g => g.items.length > 0);
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
