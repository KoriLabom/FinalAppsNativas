import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'app-layout',
    imports: [RouterOutlet,RouterLink],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent {
token=this.authService.token
constructor(private authService:AuthService){}
logOut(){
  this.authService.logout();
}
}
