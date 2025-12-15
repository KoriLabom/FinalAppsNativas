import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.scss',
})
export class ProductsAdminPageComponent implements OnInit {
  ngOnInit(): void {
    this.reload();
  }
  router=inject(Router);
async deleteProduct(productid: string) {
  console.log("TOKEN:", this.authService.token);

  await this.productsService.deleteProduct(productid);
}

editProduct(id: string | number) {
  // Ajustá esta ruta a la que uses para editar
  // Ej: /admin/products/edit/123
  this.router.navigate(['/admin/products/edit', id]);
}

createProduct() {
  // Ajustá esta ruta
  this.router.navigate(['/admin/products/new']);
}

async reload() {
  const userId = this.authService.userId;
  console.log("USERID:", userId);
  if (!userId) return; // o authService.logout()

  await this.productsService.getProductsByUser(userId);
}

  authService = inject(AuthService);
  productsService = inject(ProductService);

}
