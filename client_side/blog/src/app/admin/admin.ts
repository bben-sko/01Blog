import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../sevice/adminservice';
import { Router } from '@angular/router';



export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPosts: number;
  activePosts: number;
  hiddenPosts: number;
  deletedPosts: number;
  pendingReports: number;
  resolvedReports: number;
}

export interface Report {
  id: number;
  postId: number;
  postContent: string;
  // postImageUrl: string;
  reporterId: number;
  reporterUsername: string;
  reason: string;
  description: string;
  status: boolean;
  createdAt: string;
  adminNote: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  enable: boolean;
  createdAt: string;
  bannedAt?: string;
  banReason?: string;
}

export interface Post {
  postId: number;
  userId: number;
  username: string;
  content: string;
  imageUrl: string;
  enable: boolean;
  createdAt: string;
  hiddenAt?: string;
  hiddenReason?: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
@Injectable({
  providedIn: 'root'
})
export class Admin implements OnInit {

  private adminService = inject(AdminService);
  private route = inject(Router);
  private http = inject(HttpClient);
  stats: DashboardStats | null = null;
  users: User[] = [];
  posts: Post[] = [];
  reports: Report[] = [];

  activeTab: 'reports' | 'users' | 'posts' = 'reports';

  selectedReport: Report | null = null;
  selectedUser: User | null = null;
  selectedPost: Post | null = null;

  actionReason = '';
  adminNote = '';
  adminId = 1; // Should come from auth service
  checking = false
  loading = false;
  error = '';
  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loadReport();
    this.loadUsers();
    this.loadPosts();
    this.checking = true
  }



  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(data)
        this.loading = false;
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }
  loadReport() {
    this.loading = true;
    console.log("Loading reports...");

    const token = localStorage.getItem('jwt');

    if (!token) {
      this.route.navigate(['/login'])
      this.loading = false;
      return;
    }


    token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.adminService.getReportsByStatus("ALL")
    this.http.get<Report[]>(`http://localhost:8080/api/reports/all`, { headers }).subscribe({
      next: (data: Report[]) => {
        console.log("Reports loaded:", data);
        this.reports = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  loadPosts() {
    this.loading = true;
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.route.navigate(['/login'])
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<Post[]>(`http://localhost:8080/api/admin/posts?page=0&size=50`, { headers }).subscribe({
      next: (data) => {
        console.log(data)
        this.posts = data
        this.loading = false;
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  switchTab(tab: 'reports' | 'users' | 'posts') {
    this.activeTab = tab;
    this.error = '';
  }

  banUser(user: User) {
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.route.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post<String>(`http://localhost:8080/api/admin/users/${user.id}/ban`, {}, { headers }).subscribe({
      next: () => {
        alert('User banned successfully');
        this.actionReason = '';
        this.selectedUser = null;
        this.cdr.detectChanges()

      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  unbanUser(user: User) {
    if (!confirm('Are you sure you want to unban this user?')) return;

    this.adminService.unbanUser(user.id).subscribe({
      next: () => {
        alert('User unbanned successfully');
        this.cdr.detectChanges()

      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  deleteUser(userId: number) {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.loadUsers();
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
        console.log(err)
      }
    });
  }

  hidePost(post: Post) {
    this.adminService.hidePost(post.postId).subscribe({
      next: () => {
        alert('Post hidden successfully');
        this.adminNote = '';
        this.selectedPost = null;
        this.loadPosts();
        post.enable = !post.enable
        this.selectedPost = null;
        this.cdr.detectChanges()
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }

    });
  }

  unhidePost(post: Post) {
    if (!confirm('Are you sure you want to unhide this post?')) return;

    this.adminService.unhidePost(post.postId).subscribe({
      next: () => {
        alert('Post unhidden successfully');
        this.loadPosts();
        this.cdr.detectChanges()

      },
      error: (err) => {
        console.error(err)
      },

    });
    post.enable = !post.enable
    this.cdr.detectChanges()

  }

  deletePost(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.adminService.deletePost(postId).subscribe({
      next: () => {
        alert('Post deleted successfully');
        this.loadPosts();
        if (this.selectedReport) {
          this.closeModal();
        }
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
        console.error(err);
      }
    });
  }

  resolveReport(report: Report) {
    if (!this.adminNote.trim()) {
      alert('Please provide an admin note');
      return;
    }

    this.adminService.resolveReport(report.id, this.adminNote, this.adminId).subscribe({
      next: () => {
        alert('Report resolved successfully');
        this.adminNote = '';
        this.selectedReport = null;

      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  openReportModal(report: Report) {
    this.selectedReport = report;
    this.adminNote = '';
  }

  openBanUserModal(user: User) {
    this.selectedUser = user;
    this.actionReason = '';
  }

  openHidePostModal(post: Post) {
    this.selectedPost = post;
    this.actionReason = '';
  }

  closeModal() {
    this.selectedReport = null;
    this.selectedUser = null;
    this.selectedPost = null;
    this.actionReason = '';
    this.adminNote = '';
  }

  hidePostFromReport(postId: number) {
    if (!this.actionReason.trim()) {
      this.actionReason = 'Reported content violation';
    }

    this.adminService.hidePost(postId).subscribe({
      next: (a) => {
        alert('Post hidden successfully');
        this.actionReason = '';
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  deletePostFromReport(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.adminService.deletePost(postId).subscribe({
      next: () => {
        alert('Post deleted successfully');
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
        
      }
    });
  }
  GetViews(postId: number) {
     window.open(`post/${postId}`);
  }
}