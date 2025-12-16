import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginData } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  auth=inject(AuthService)
  isLoading=false
  errorLogin=false
  /*async login(form:any){
    console.log(form.value)
    this.errorLogin = false;
    let logindata:LoginData={
      restaurantName:form.restaurantName,
      password:form.password
    }
    this.isLoading = true;
    await this.auth.login(logindata);
    this.isLoading = false;
    this.errorLogin = true;
    
  }*/

    async login(form: any) {
    console.log(form.value);
    this.errorLogin = false; 
    let logindata: LoginData = {
      restaurantName: form.restaurantName,
      password: form.password
    };

    this.isLoading = true;

    try {
      await this.auth.login(logindata);
      this.isLoading = false;
    } catch (error) {
      console.error('Login fallido:', error);
      this.isLoading = false; 
      this.errorLogin = true; 
    }
  }
}
