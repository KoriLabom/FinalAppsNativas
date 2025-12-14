import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';

type LoginResponse = {
  token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Guardamos el valor en memoria y lo sincronizamos con localStorage
  private _token: string | null = localStorage.getItem('token');

  // Getter público (solo lectura desde afuera)
  get token(): string | null {
    return this._token;
  }

  // (Opcional) para chequear rápido en la UI/guards
  get isLoggedIn(): boolean {
    return !!this._token;
  }

  /** Decodifica el JWT y devuelve el payload (o null si no hay token) */
  parseJwt(token: string | null): any | null {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  /** (Opcional) Te devuelve el payload del usuario ya parseado */
  getUserPayload(): any | null {
    return this.parseJwt(this._token);
  }

  /** Header listo para usar */
  getAuthorizationHeader(): HeadersInit {
    if (!this._token) return {};
    return { Authorization: `Bearer ${this._token}` };
  }

  /** Autentica al usuario en el back y guarda SOLO el JWT */
  async login(loginData: LoginData) {
    const res = await fetch(
      'https://w370351.ferozo.com/api/Authentication/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      }
    );

    if (!res.ok) {
      // Podés mejorar esto leyendo res.json() si el back manda mensaje de error
      throw new Error('Login inválido');
    }

    // Si el back devuelve { token: "..." }
    const data = (await res.json()) as LoginResponse;

    this._token = data.token;                 // ✅ solo el token
    localStorage.setItem('token', this._token);

    this.router.navigate(['/admin/products']);
  }

  /** Cierra sesión */
  logout() {
    this._token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
