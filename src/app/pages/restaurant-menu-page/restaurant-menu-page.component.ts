import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService, Restaurant, MenuProduct } from '../../services/restaurant.service';

type GroupedCategory = { name: string; items: MenuProduct[] };

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

  private loadRestaurantAndMenu(id: string) {
    this.isLoading = true;
    this.errorMsg = null;

    this.restaurantService.getRestaurantById(id).subscribe({
      next: (r) => {
        this.restaurant = r;

        this.restaurantService.getMenuByRestaurantId(id).subscribe({
          next: (items) => {
            this.products = items ?? [];
            this.grouped = this.groupByCategory(this.products);
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

  private groupByCategory(items: MenuProduct[]): GroupedCategory[] {
    const map = new Map<string, MenuProduct[]>();

    for (const p of items) {
      const cat =
        p.categoryName && p.categoryName.trim()
          ? p.categoryName.trim()
          : 'Sin categoría';

      const arr = map.get(cat) ?? [];
      arr.push(p);
      map.set(cat, arr);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, list]) => ({
        name,
        items: list.slice().sort((x, y) => String(x.name ?? '').localeCompare(String(y.name ?? ''))),
      }));
  }

  // Helpers por compatibilidad con nombres de tu API
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

  trackCategory = (_: number, c: GroupedCategory) => c.name;
  trackProduct = (_: number, p: MenuProduct) => p.id;
}
