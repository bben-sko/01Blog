import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface TokenVerifyResponse {
    valid: boolean;
    err?: string;
}

export const TokenGuard: CanActivateFn = async (): Promise<boolean> => {
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

        const response = await firstValueFrom(
            http.post<TokenVerifyResponse>(
                "http://localhost:8080/api/auth/verifytoken",
                {},
                { headers }
            )
        );


        if (response.valid) {
            return true;
        } else {
            router.navigate(['/login']);
            return false;
        }
    } catch (error) {
        router.navigate(['/login']);
        return false;
    }
};
