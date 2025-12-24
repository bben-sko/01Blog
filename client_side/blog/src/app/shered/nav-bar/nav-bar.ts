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
  UserResponse: UserResponse = {username : "", role : ""};
  menuOpen = false;
  isnotificated: boolean = false;
  loding: boolean = false;
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
      return;
    }

    const token = localStorage.getItem('jwt');

    if (!token) {
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
          this.loding = true
          this.cdr.detectChanges();
        },
        error: (error) => {
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
      return;
    }

    const token = localStorage.getItem('jwt');

    if (!token) {
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
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.router.navigate(['/login']);
        }
      });
  }
}
