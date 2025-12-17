import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService, Restaurant, MenuProduct } from '../../services/restaurant.service';

type GroupedCategory = { name: string; items: MenuProduct[] };

@Component({
  selector: 'app-restaurant-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss',
})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);

  isLoading = true;
  errorMsg: string | null = null;

  restaurant: Restaurant | null = null;

  // menú
  menuLoading = false;
  menuError: string | null = null;
  products: MenuProduct[] = [];
  grouped: GroupedCategory[] = [];

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.errorMsg = 'Falta el nombre (slug) del restaurante en la URL.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    try {
      // 1) Traer todos
      const restaurants = await this.restaurantService.getRestaurants();
      const list = restaurants ?? [];

      // 2) Buscar por slug
      const found = list.find(r => this.slugify(r.restaurantName) === slug);

      if (!found) {
        this.errorMsg = 'Restaurante no encontrado (slug inválido).';
        this.isLoading = false;
        return;
      }

      const id = String(found.id);

      // 3) Cargar detalle
      const r = await this.restaurantService.getRestaurantById(id);
      if (!r) {
        this.errorMsg = 'No se pudo cargar el restaurante.';
        this.isLoading = false;
        return;
      }

      this.restaurant = r;
      this.isLoading = false;

      // 4) Cargar menú
      await this.loadMenu(id);
    } catch (err) {
      console.error(err);
      this.errorMsg = 'No se pudo cargar el restaurante.';
      this.isLoading = false;
    }
  }

  private slugify(text: string): string {
    return String(text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async loadMenu(id: string) {
    this.menuLoading = true;
    this.menuError = null;

    try {
      const items = await this.restaurantService.getMenuByRestaurantId(id);
      this.products = items ?? [];
      this.grouped = this.groupByCategory(this.products);
    } catch (err) {
      console.error(err);
      this.menuError = 'No se pudo cargar el menú.';
    } finally {
      this.menuLoading = false;
    }
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
        items: list
          .slice()
          .sort((x, y) => String(x.name ?? '').localeCompare(String(y.name ?? ''))),
      }));
  }

  // helpers compat
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
