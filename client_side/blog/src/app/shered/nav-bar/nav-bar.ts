import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';


interface UserResponse {
  username: string;
  role: string;
}

interface notificationResponse {
  notificated: boolean;
}
@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})

export class NavBar implements OnInit {
  UserResponse: UserResponse | null = null;
  menuOpen = false;
  isnotificated: boolean = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr : ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.getCurrentUser();
  }
  getCurrentUser() {
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
          this.UserResponse = data;
          this.getisnotificated();
          this.cdr.detectChanges();
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  getUserInitials() {
    if (!this.UserResponse?.username) {
      return '?';
    }
    return this.UserResponse.username.substring(0, 1).toUpperCase();
  }

  getisnotificated() {
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
      this.http.get<notificationResponse>('http://localhost:8080/api/notifications/unread', { headers })
      .subscribe({
        next: (data) => {
          this.isnotificated = data.notificated;
          console.log("notificated:", this.isnotificated);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching current user', error);
          this.router.navigate(['/login']);
        }
      });
  }
}
