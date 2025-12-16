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

  // ✅ menú
  menuLoading = false;
  menuError: string | null = null;
  products: MenuProduct[] = [];
  grouped: GroupedCategory[] = [];

  ngOnInit(): void {
    // ✅ ahora leemos slug, no id
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.errorMsg = 'Falta el nombre (slug) del restaurante en la URL.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    // 1) Traer todos
    this.restaurantService.getRestaurants().subscribe({
      next: (list) => {
        const restaurants = list ?? [];

        // 2) Buscar el match por slug
        const found = restaurants.find((r: any) =>
          this.slugify(r.restaurantName ?? r.name) === slug
        );

        if (!found) {
          this.errorMsg = 'Restaurante no encontrado (slug inválido).';
          this.isLoading = false;
          return;
        }

        const id = String(found.id);

        // 3) Cargar detalle por id (como antes)
        this.restaurantService.getRestaurantById(id).subscribe({
          next: (r) => {
            this.restaurant = r;
            this.isLoading = false;

            // ✅ cargar menú debajo
            this.loadMenu(id);
          },
          error: (err) => {
            console.error(err);
            this.errorMsg = 'No se pudo cargar el restaurante.';
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo cargar la lista de restaurantes.';
        this.isLoading = false;
      },
    });
  }

  private slugify(text: string): string {
    return String(text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private loadMenu(id: string) {
    this.menuLoading = true;
    this.menuError = null;

    this.restaurantService.getMenuByRestaurantId(id).subscribe({
      next: (items) => {
        this.products = items ?? [];
        this.grouped = this.groupByCategory(this.products);
        this.menuLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.menuError = 'No se pudo cargar el menú.';
        this.menuLoading = false;
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
