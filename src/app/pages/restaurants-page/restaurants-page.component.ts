import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';   
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
@Component({
  selector: 'app-restaurants-page',
  imports: [
    CommonModule, 
    RouterLink 
  ], 
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.scss',
  standalone: true 
})
export class RestaurantsPageComponent implements OnInit { 
  
  
  restaurants: Restaurant[] = []; 
  isLoading: boolean = true; 

  constructor(private restaurantService: RestaurantService) { } 

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
        this.isLoading = false;
      }
    });
  }
  slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

}