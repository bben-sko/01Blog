import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    postImageUrl: string;
    reporterId: number;
    reporterUsername: string;
    reason: string;
    description: string;
    status: string;
    createdAt: string;
    adminNote: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar: string;
    status: string;
    createdAt: string;
    bannedAt?: string;
    banReason?: string;
}

export interface Post {
    id: number;
    userId: number;
    username: string;
    content: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    hiddenAt?: string;
    hiddenReason?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private API_URL = 'http://localhost:8080/api/admin';

    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`);
    }

    getPendingReports(): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.API_URL}/reports/pending`);
    }

    getAllUsers(page: number = 0, size: number = 50): Observable<User[]> {
        return this.http.get<User[]>(`${this.API_URL}/users?page=${page}&size=${size}`);
    }

    getAllPosts(page: number = 0, size: number = 50): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.API_URL}/posts?page=${page}&size=${size}`);
    }

    banUser(userId: number, reason: string): Observable<any> {
        return this.http.post(`${this.API_URL}/users/${userId}/ban`, { reason });
    }

    unbanUser(userId: number): Observable<any> {
        return this.http.post(`${this.API_URL}/users/${userId}/unban`, {});
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/users/${userId}`);
    }

    hidePost(postId: number, reason: string): Observable<any> {
        return this.http.post(`${this.API_URL}/posts/${postId}/hide`, { reason });
    }

    unhidePost(postId: number): Observable<any> {
        return this.http.post(`${this.API_URL}/posts/${postId}/unhide`, {});
    }

    deletePost(postId: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/posts/${postId}`);
    }

    resolveReport(reportId: number, adminNote: string, adminId: number): Observable<any> {
        return this.http.post(`${this.API_URL}/reports/${reportId}/resolve`, {
            adminNote,
            adminId: adminId.toString()
        });
    }
}