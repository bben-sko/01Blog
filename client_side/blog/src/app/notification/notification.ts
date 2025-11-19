// notification.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives
import { NotificationService } from '../sevice/notificationservice';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
NotificationService

// Define the interface - renamed to avoid conflict with component class
export interface NotificationItem {
  id: number;
  message: string;
  postId: number;
  postTitle: string;
  isRead: boolean;
  createdAt: string;
}



@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NavBar, CommonModule], // Add CommonModule for *ngFor, *ngIf, DatePipe, etc.
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification implements OnInit {
  // Use the renamed interface
  notifications: NotificationItem[] = [];
  unreadCount: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loadNotification()

  }
  loadNotification(){
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    this.http.get<NotificationItem[]>('http://localhost:8080/api/notifications', { headers }).subscribe({
                    next: (notifications) => {
                      this.notifications = notifications
                     this.cdr.detectChanges();

                    },
                    error: (error) => {
                        return []
                    }
                });
  }  
  onNotificationClick(notification: NotificationItem): void {
    if (!notification.isRead) {
      notification.isRead = true;
      this.router.navigate([`/post/${notification.postId}`])
    }
  }
}
