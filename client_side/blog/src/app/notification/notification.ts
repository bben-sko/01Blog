// notification.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives
import { NotificationService } from '../sevice/notificationservice';
import { NavBar } from '../shered/nav-bar/nav-bar';

// Define the interface - renamed to avoid conflict with component class
export interface NotificationItem {
  id: number;
  message: string;
  postId: number;
  postTitle: string;
  isRead: boolean;
  createdAt: string;
}

// Fake data moved outside the class
export const FAKE_NOTIFICATIONS: NotificationItem[] = [
  {
    "id": 12,
    "message": "Omar Tahiri posted a new blog: Building RESTful APIs with Java",
    "postId": 471,
    "postTitle": "Building RESTful APIs with Java",
    "isRead": false,
    "createdAt": "2025-11-16T14:10:52.361025"
  },
  {
    "id": 3,
    "message": "Omar Tahiri posted a new blog: Testing Spring Boot Applications",
    "postId": 263,
    "postTitle": "Testing Spring Boot Applications",
    "isRead": false,
    "createdAt": "2025-11-16T13:10:52.360956"
  },
  {
    "id": 1,
    "message": "Youssef Benali posted a new blog: Building a Blog Platform from Scratch",
    "postId": 132,
    "postTitle": "Building a Blog Platform from Scratch",
    "isRead": false,
    "createdAt": "2025-11-16T07:10:52.360921"
  },
  {
    "id": 6,
    "message": "Youssef Benali posted a new blog: Git Workflow Best Practices",
    "postId": 126,
    "postTitle": "Git Workflow Best Practices",
    "isRead": false,
    "createdAt": "2025-11-15T09:10:52.360980"
  },
  {
    "id": 10,
    "message": "Ahmed El Mansouri posted a new blog: Building a Blog Platform from Scratch",
    "postId": 338,
    "postTitle": "Building a Blog Platform from Scratch",
    "isRead": false,
    "createdAt": "2025-11-15T04:10:52.361010"
  },
  {
    "id": 13,
    "message": "Ahmed El Mansouri posted a new blog: CSS Grid vs Flexbox: Which One to Use?",
    "postId": 476,
    "postTitle": "CSS Grid vs Flexbox: Which One to Use?",
    "isRead": false,
    "createdAt": "2025-11-15T00:10:52.361033"
  },
  {
    "id": 15,
    "message": "Fatima Zahra posted a new blog: Modern JavaScript ES6+ Features",
    "postId": 228,
    "postTitle": "Modern JavaScript ES6+ Features",
    "isRead": true,
    "createdAt": "2025-11-14T05:10:52.361047"
  },
  {
    "id": 4,
    "message": "Fatima Zahra posted a new blog: Bootstrap 5: What's New?",
    "postId": 331,
    "postTitle": "Bootstrap 5: What's New?",
    "isRead": false,
    "createdAt": "2025-11-13T13:10:52.360964"
  },
  {
    "id": 9,
    "message": "Youssef Benali posted a new blog: Testing Spring Boot Applications",
    "postId": 237,
    "postTitle": "Testing Spring Boot Applications",
    "isRead": true,
    "createdAt": "2025-11-13T09:10:52.361003"
  },
  {
    "id": 8,
    "message": "Ahmed El Mansouri posted a new blog: CSS Grid vs Flexbox: Which One to Use?",
    "postId": 476,
    "postTitle": "CSS Grid vs Flexbox: Which One to Use?",
    "isRead": true,
    "createdAt": "2025-11-13T09:10:52.360996"
  },
  {
    "id": 11,
    "message": "Khadija Alami posted a new blog: 10 Angular Best Practices Every Developer Should Know",
    "postId": 432,
    "postTitle": "10 Angular Best Practices Every Developer Should Know",
    "isRead": true,
    "createdAt": "2025-11-12T13:10:52.361017"
  },
  {
    "id": 2,
    "message": "Fatima Zahra posted a new blog: Microservices Architecture Explained",
    "postId": 500,
    "postTitle": "Microservices Architecture Explained",
    "isRead": false,
    "createdAt": "2025-11-11T05:10:52.360945"
  },
  {
    "id": 7,
    "message": "Youssef Benali posted a new blog: Getting Started with Spring Boot: A Complete Guide",
    "postId": 191,
    "postTitle": "Getting Started with Spring Boot: A Complete Guide",
    "isRead": false,
    "createdAt": "2025-11-10T22:10:52.360988"
  },
  {
    "id": 5,
    "message": "Fatima Zahra posted a new blog: Modern JavaScript ES6+ Features",
    "postId": 283,
    "postTitle": "Modern JavaScript ES6+ Features",
    "isRead": false,
    "createdAt": "2025-11-10T22:10:52.360972"
  },
  {
    "id": 14,
    "message": "Youssef Benali posted a new blog: Building a Blog Platform from Scratch",
    "postId": 143,
    "postTitle": "Building a Blog Platform from Scratch",
    "isRead": true,
    "createdAt": "2025-11-10T15:10:52.361040"
  }
];

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
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize with fake data for testing
    // this.notifications = FAKE_NOTIFICATIONS;

   
    this.notifications = this.notificationService.loadNotifications()
    console.log(this.notificationService.loadNotifications()+"====================")
  }

  // Method to handle notification click
  onNotificationClick(notification: NotificationItem): void {
    if (!notification.isRead) {
      // Mark as read locally
      notification.isRead = true;

      // Uncomment when using real service
      // this.notificationService.markAsRead(notification.id).subscribe();
    }
    // Navigate to the post
    this.router.navigate(['/posts', notification.postId]);
  }




}
