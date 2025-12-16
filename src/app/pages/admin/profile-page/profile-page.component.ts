import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Restaurant, RestaurantService } from '../../../services/restaurant.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = true;
  isSaving = false;
  errorMsg: string | null = null;

  restaurant: Restaurant | null = null;

  // Form (edit)
  form: Partial<Restaurant> = {
    restaurantName: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    // password: '' // si querés permitir cambiarla, descomentá y agregá input
  };

  async ngOnInit(): Promise<void> {
    const id = this.authService.userId;

    if (!id) {
      this.errorMsg = 'No hay usuario logueado.';
      this.isLoading = false;
      return;
    }

    try {
      this.isLoading = true;
      this.errorMsg = null;

      const r = await this.restaurantService.getRestaurantById(id);
      if (!r) {
        this.errorMsg = 'No se pudo cargar el perfil del restaurante.';
        this.isLoading = false;
        return;
      }

      this.restaurant = r;

      // cargar form
      this.form = {
        restaurantName: r.restaurantName ?? '',
        firstName: r.firstName ?? '',
        lastName: r.lastName ?? '',
        address: r.address ?? '',
        phoneNumber: r.phoneNumber ?? '',
      };
    } catch (e) {
      console.error(e);
      this.errorMsg = 'Error al cargar el perfil.';
    } finally {
      this.isLoading = false;
    }
  }

  async save(): Promise<void> {
    const id = this.authService.userId;
    if (!id) return;

    // validación mínima
    if (!String(this.form.restaurantName ?? '').trim()) {
      await Swal.fire({ title: 'Falta nombre', text: 'Ingresá el nombre del restaurante.', icon: 'info' });
      return;
    }

    try {
      this.isSaving = true;
      this.errorMsg = null;

      const edited = await this.restaurantService.editRestaurant(id, this.form);
      if (!edited) {
        await Swal.fire({ title: 'Error', text: 'No se pudo guardar.', icon: 'error' });
        return;
      }

      this.restaurant = edited;

      await Swal.fire({ title: 'Guardado', text: 'Perfil actualizado correctamente.', icon: 'success' });
    } catch (e) {
      console.error(e);
      await Swal.fire({ title: 'Error', text: 'Ocurrió un error al guardar.', icon: 'error' });
    } finally {
      this.isSaving = false;
    }
  }
confirmarLogout(): void {
    const confirmado = confirm('¿Está seguro que quiere cerrar sesión?');

    if (confirmado) {
      this.authService.logout(); 
    }
  }
  async deleteRestaurant(): Promise<void> {
    const id = this.authService.userId;
    if (!id) return;

    const result = await Swal.fire({
      title: '¿Eliminar restaurante?',
      text: 'Esta acción es permanente y eliminará tu cuenta/restaurante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${this.restaurantService.URL_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: {
          ...this.authService.getAuthorizationHeader(),
        },
      });

      if (!res.ok) {
        await Swal.fire({ title: 'Error', text: 'No se pudo eliminar el restaurante.', icon: 'error' });
        return;
      }

      await Swal.fire({ title: 'Eliminado', text: 'Tu restaurante fue eliminado.', icon: 'success' });

      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error(e);
      await Swal.fire({ title: 'Error', text: 'Ocurrió un error al eliminar.', icon: 'error' });
    }
  }

  cancel(): void {
    // vuelve a cargar lo original del objeto restaurant
    if (!this.restaurant) return;
    this.form = {
      restaurantName: this.restaurant.restaurantName ?? '',
      firstName: this.restaurant.firstName ?? '',
      lastName: this.restaurant.lastName ?? '',
      address: this.restaurant.address ?? '',
      phoneNumber: this.restaurant.phoneNumber ?? '',
    };
  }
}
