import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const TokenGuard: CanActivateFn = () => {
    const router = inject(Router);
    const http = inject(HttpClient);
    const token = localStorage.getItem('jwt');

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    try {
        http.post<any>("http://localhost:8080/api/auth/verifytoken", { token: token })
        .subscribe({
            next: (response) => {
                if (response.valid) {
                    return true;
                } else {
                    router.navigate(['/login']);
                    return false;
                }
            },
            error: (error) => {
                router.navigate(['/login']);
                return false;
            }
        });
    } catch (error) {
        console.error('Failed to parse JWT token', error);
    }

    router.navigate(['/']);
    return false;
};