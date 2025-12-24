import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  users: Users[] = [];
  loading = false;
  searchTerm = '';
  pageSize = 10;
  currentPage = 0;
  hasMore = true;
  currentSearchTerm = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
  }

  private fetchUsers() {
    if (!localStorage.getItem('jwt')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    const headers = { Authorization: `Bearer ${localStorage.getItem('jwt')}` };
    let params = new HttpParams()
      .set('page', this.currentPage)
      .set('size', this.pageSize);

    let url = 'http://localhost:8080/api/users/all';
    const query = this.currentSearchTerm.trim();
    if (query) {
      url = 'http://localhost:8080/api/users/search';
      params = params.set('query', query);
    }

    this.http.get<Users[]>(url, { headers, params })
      .subscribe({
        next: (data: Users[]) => {
          this.loading = false;
          if (this.currentPage === 0) {
            this.users = data;
          } else {
            this.users = [...this.users, ...data];
          }
          this.hasMore = data.length === this.pageSize;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loading = false;
        }
      });
  }

  loadUsers() {
    this.currentPage = 0;
    this.users = [];
    this.hasMore = true;
    this.currentSearchTerm = '';
    this.fetchUsers();
  }

  onSearchTermChange() {
    this.currentSearchTerm = this.searchTerm.trim();
    this.currentPage = 0;
    this.users = [];
    this.hasMore = true;
    this.fetchUsers();
  }

  toggleFollow(user: Users) {
    
    const token = localStorage.getItem('jwt');

    if (!token) {
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
          },
          error: (error) => {}
        });
    } else {
      
      // Send to backend
      this.http.delete(`http://localhost:8080/api/follow/${user.user.username}`, { headers })
        .subscribe({
          next: (a) => {
            user.isfollow = false;
          },
          error: (error) => {}
        });
    }
    this.cdr.detectChanges();

  }

  viewProfile(User: string) {
    this.router.navigate([`/profile/${ User }`]);
  }

  showMore() {
    if (this.loading || !this.hasMore) {
      return;
    }
    this.currentPage += 1;
    this.fetchUsers();
  }
}
