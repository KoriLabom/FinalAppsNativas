import { inject, Injectable } from '@angular/core';
import { LoginData } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  token : null|string = localStorage.getItem("token");

    /** Autentica al usuario en el back y nos devuelve el token */
  async login(loginData: LoginData){
    const res = await fetch("https://w370351.ferozo.com/api/Authentication/login",
      {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginData)
      }
    )
    if(res.ok){
      this.token = await res.text()
      localStorage.setItem("token",this.token);
      this.router.navigate(["/"])
    }
  }

  /** Cierra sesión */
  logout(){
    this.token = null;
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
}
