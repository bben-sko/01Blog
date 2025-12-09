import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


interface TokenVerifyResponse {
    valid: boolean;
    err?: string;
}

export const TokenGuard: CanActivateFn = () => {
    const router = inject(Router);
    const http = inject(HttpClient);
    const token = localStorage.getItem('jwt');

    if (!token) {
        router.navigate(['/login']);
        return false;
    }
 

    try {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        http.post<TokenVerifyResponse>("http://localhost:8080/api/auth/verifytoken", {},{ headers })
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
                console.error('Token verification failed:', error);
                router.navigate(['/login']);
                return false;
            }
        });
    } catch (error) {
        console.error('Failed to parse JWT token', error);
        router.navigate(['/']);
        return false;
    }

    // router.navigate(['/']);
    return false;
};