import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';

export interface Notification {
    id: number;
    message: string;
    postId: number;
    postTitle: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';

   

    private unreadCount = 0;
    



    constructor(private http: HttpClient) { }

   
   

  

    

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/unread-count`);
    }

    markAsRead(notificationId: number) {
          return  this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {})
        
    }




}
