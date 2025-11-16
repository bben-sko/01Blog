import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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

   
   

  

    loadNotifications(): any {
        this.http.get<Notification[]>(this.apiUrl).subscribe({
                next: (notifications) => {
                    return notifications
                },
                error: (error) => {
                    console.log(error.message + "=============")
                    return []
                }
            });
       
    }


    getUnreadCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/unread-count`);
    }

    markAsRead(notificationId: number) {
          return  this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {})
        
    }




}
