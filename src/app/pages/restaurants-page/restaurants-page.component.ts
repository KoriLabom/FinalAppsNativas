import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurants-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.scss',
  standalone: true,
})
export class RestaurantsPageComponent implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading: boolean = true;

  constructor(private restaurantService: RestaurantService) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      const data = await this.restaurantService.getRestaurants();
      this.restaurants = data ?? [];
    } catch (err) {
      console.error('Error al obtener los datos:', err);
    } finally {
      this.isLoading = false;
    }
  }

  slugify(text: string): string {
    return String(text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
