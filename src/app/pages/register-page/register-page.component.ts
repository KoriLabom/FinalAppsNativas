/*import { Component } from '@angular/core';

@Component({
    selector: 'app-register-page',
    imports: [],
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
    standalone: true
})
export class RegisterPageComponent {

}*/

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterData } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-regsiter-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  auth=inject(AuthService)
  isLoading=false
  errorRegister=false
  async register(form:any){
    console.log(form.value)
    this.errorRegister = false;
    let registerdata:RegisterData={
      restaurantName:form.restaurantName,
      email:form.email,
      password:form.password
    }
    this.isLoading = true;
    await this.auth.register(registerdata);
    this.isLoading = false;
    this.errorRegister = true;
    
  }
}

