import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Restaurant {
  id: number;
  restaurantName: string,
  password: string;       
  firstName: string;      
  lastName: string;       
  address: string;        
  phoneNumber: string;
}


@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'https://w370351.ferozo.com/api/users' ;
  
  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);

}
}
