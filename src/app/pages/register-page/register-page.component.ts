import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../interfaces/auth';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
})
export class RegisterPageComponent {
  auth = inject(AuthService);

  isLoading = false;
  errorRegister = false;

  async register(form: any) {
    this.errorRegister = false;

    const data: RegisterData = {
      restaurantName: form.restaurantName,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      phoneNumber: form.phoneNumber,
    };

    try {
      this.isLoading = true;
      await this.auth.register(data);
    } catch (e) {
      console.error(e);
      this.errorRegister = true;
    } finally {
      this.isLoading = false;
    }
  }
}
