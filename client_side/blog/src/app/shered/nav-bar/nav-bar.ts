import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';


interface UserResponse {
  username: string;
}

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})

export class NavBar implements OnInit {
  username: UserResponse | null = null;
  profileusername: string = "";

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

 
  ngOnInit() {
    this.getCurrentUser();
  }
  getCurrentUser() {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.log('localStorage not available');
      return;
    }

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<UserResponse>('http://localhost:8080/api/users/me', { headers })
      .subscribe({
        next: (data) => {
          this.username = data;
          this.profileusername = this.username.username;
          console.log(this.username.username);
        },
        error: (error) => {
          console.error('Error fetching current user', error);
          
            this.router.navigate(['/login']);
          
        }
      });
  }
  Logout() {
    localStorage.removeItem("jwt")
    this.router.navigate(["/login"])
  }
}
