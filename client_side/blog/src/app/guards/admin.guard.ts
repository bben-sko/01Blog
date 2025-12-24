import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload?.role === 'ADMIN_USER') {
      return true;
    }
  } catch (error) {
    router.navigate(['/login']);
  }

  router.navigate(['/']);
  return false;
};
