import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

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
async deleteProduct(id: string, productid: string) {
  await this.productsService.deleteProduct(id,productid);
}

editProduct(id: string | number) {
  // Ajustá esta ruta a la que uses para editar
  // Ej: /admin/products/edit/123
  this.authService.router.navigate(['/admin/products/edit', id]);
}

createProduct() {
  // Ajustá esta ruta
  this.authService.router.navigate(['/admin/products/create']);
}

async reload() {
  const userId = localStorage.getItem("userId");
  if (!userId) return; // o authService.logout()

  await this.productsService.getProductsByUser(userId);
}

  authService = inject(AuthService);
  productsService = inject(ProductService);

}
