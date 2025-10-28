import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

export class authcheck {
    constructor(private http: HttpClient, private router: Router) {}

    checkAuth() {
        const token = localStorage.getItem('jwt');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.get('http://localhost:8080/api/users/me', { headers })
            .subscribe({
                next: () => {
                   this.router.navigate(['/']);
                },
                error: (error) => {
                    console.error('Error fetching current user', error);

                    this.router.navigate(['/login']);

                }
            });
        
    }
}