import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavBar } from '../nav-bar/nav-bar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface User {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  isfollowed?: boolean;
}

export interface Users {
  user: User;
  isfollow: boolean;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBar],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  users: Users[] = [];
  loading = false;
  searchTerm = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    if (!localStorage.getItem('jwt')) {
      this.router.navigate(['/login']);
      return;
    }
    this.http.get<Users[]>('http://localhost:8080/api/users/all', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .subscribe({
        next: (data: Users[]) => {
          this.loading = false;
          this.users = data;
          
          for (const userData of data) {
            console.log('User:', userData);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        }
      });
  }

  onSearchTermChange() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    const headers = { Authorization: `Bearer ${localStorage.getItem('jwt')}` };
    this.http.get<Users[]>(`http://localhost:8080/api/users/search?query=${encodeURIComponent(term)}`, { headers })
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error searching users:', error);
          this.loading = false;
        }
      });
  }

  toggleFollow(user: Users) {
    
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.router.navigate(['/login']);
      return;
    }
    // Create headers with Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
      if (!localStorage.getItem('jwt')) {
        this.router.navigate(['/login']);
        return;
      }
    if (!user.isfollow) {
      this.http.post(`http://localhost:8080/api/follow/${user.user.username}`, {}, { headers })
        .subscribe({
          next: (a) => { user.isfollow = true;
            console.log(a)
          },
          error: (error) => console.error('Error following user:', error)
        });
    } else {
      console.log(`Unfollowed ${user.user.username}`);
      
      // Send to backend
      this.http.delete(`http://localhost:8080/api/follow/${user.user.username}`, { headers })
        .subscribe({
          next: (a) => {
            user.isfollow = false;
            console.log(a)
          },
          error: (error) => console.error('Error unfollowing user:', error)
        });
    }
    this.cdr.detectChanges();

  }

  viewProfile(User: string) {
    this.router.navigate([`/profile/${ User }`]);
  }
}
