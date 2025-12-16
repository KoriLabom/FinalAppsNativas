import { CanActivateFn, RedirectCommand, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/** Guard que verifica que un usuario se encuentre deslogueado */
export const onlyGuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  if (!authService.token) return true;
  const router = inject(Router)
  const urlTree: UrlTree = router.parseUrl('/admin/products');
  return new RedirectCommand(urlTree);
};
