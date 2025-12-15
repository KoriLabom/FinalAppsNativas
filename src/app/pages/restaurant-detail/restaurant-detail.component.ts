import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, RouterLink } from '@angular/router'; // ActivatedRoute para leer la URL
import { RestaurantService, Restaurant } from '../../services/restaurant.service'; // Reutilizamos el servicio

@Component({
  selector: 'app-restaurant-detail',
  imports: [CommonModule, RouterLink], // RouterLink para el botón de regreso
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss',
  standalone: true 
})
export class RestaurantDetailComponent implements OnInit { 
  
  // El objeto que contendrá el detalle del restaurante
  restaurant: Restaurant | undefined; 
  restaurantIndex: number = -1; 
  isLoading: boolean = true; 

  constructor(
    private route: ActivatedRoute, // Inyectamos ActivatedRoute
    private restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    // Suscribirse a los parámetros de la URL para obtener el ID/índice
    this.route.paramMap.subscribe(params => {
      // Intentamos convertir el parámetro 'id' (que viene como string) a número
      this.restaurantIndex = Number(params.get('id')); 
      this.loadRestaurantDetail();
    });
  }

  loadRestaurantDetail() {
    this.restaurantService.getRestaurants().subscribe({
        next: (restaurants) => {
            this.isLoading = false;
            
            // Buscamos el restaurante por el índice.
            if (this.restaurantIndex >= 0 && this.restaurantIndex < restaurants.length) {
                this.restaurant = restaurants[this.restaurantIndex];
            } else {
                // Si el índice no existe
                this.restaurant = undefined; 
            }
        },
        error: (err) => {
            console.error('Error al cargar la lista para detalle:', err);
            this.isLoading = false;
            this.restaurant = undefined;
        }
    });
  }
}