// notification.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Define the interface - renamed to avoid conflict with component class
export interface NotificationItem {
  id: number;
  message: string;
  postId: number;
  postTitle: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPage {
  content: NotificationItem[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [ CommonModule], // Add CommonModule for *ngFor, *ngIf, DatePipe, etc.
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification implements OnInit {
  // Use the renamed interface
  notifications: NotificationItem[] = [];
  unreadCount: number = 0;
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  totalItems = 0;
  hasMore = false;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loadNotifications();

  }
  loadNotifications(page: number = 0, append: boolean = false): void {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return;
    }

    this.loading = true;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', this.pageSize.toString())
      .set('unreadOnly', 'false');

    this.http.get<NotificationPage>('http://localhost:8080/api/notifications', { headers, params }).subscribe({
      next: (response) => {
        this.notifications = append
          ? [...this.notifications, ...response.content]
          : response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.pageSize = response.size;
        this.hasMore = this.currentPage + 1 < this.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load notifications', error);
        if (!append) {
          this.notifications = [];
          this.totalPages = 0;
          this.totalItems = 0;
        }
        this.hasMore = false;
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.hasMore) {
      this.loadNotifications(this.currentPage + 1, true);
    }
  }

  onNotificationClick(notification: NotificationItem): void {
    if (!notification.postId) {
      return;
    }

    if (!notification.isRead) {
      notification.isRead = true;
      const headers = this.getAuthHeaders();
      if (!headers) {
        return;
      }

      this.http.put(`http://localhost:8080/api/notifications/${notification.id}/read`, {}, { headers }).subscribe({
        next: () => {
          this.router.navigate([`/post/${notification.postId}`]);
        },
        error: (error) => {
          console.error(error);
          this.router.navigate([`/post/${notification.postId}`]);
        }
      });
      return;
    }

    this.router.navigate([`/post/${notification.postId}`]);
  }

  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

}
