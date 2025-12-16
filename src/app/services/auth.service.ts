import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { RegisterData } from '../interfaces/auth';

type LoginResponse = {
  token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async register(data: RegisterData): Promise<void> {
    try {
      const response = await this.http.post('/api/auth/register', data).toPromise();
      console.log('Registro exitoso:', response);
      return response as void;
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    }
  }
  private router = inject(Router);

  private _token: string | null = localStorage.getItem('token');

  get token(): string | null {
    return this._token;
  }

  get isLoggedIn(): boolean {
    return !!this._token;
  }

  get userId(): string | null {
    const payload = this.parseJwt(this._token);
    return payload?.sub ?? null;
  }

  parseJwt(token: string | null): any | null {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  getAuthorizationHeader(): HeadersInit {
    if (!this._token) return {};
    return { Authorization: `Bearer ${this._token}` };
  }

  async login(loginData: LoginData) {
    const res = await fetch(
      'https://w370351.ferozo.com/api/Authentication/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      }
    );

    if (!res.ok) throw new Error('Login inválido');

    const data = (await res.json()) as { token: string };

    this._token = data.token;
    localStorage.setItem('token', this._token);

    this.router.navigate(['/admin/products']);
  }

  logout() {
    this._token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
