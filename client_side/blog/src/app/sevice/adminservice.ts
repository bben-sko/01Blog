import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    getTokern(): HttpHeaders | null {
        const token = localStorage.getItem('jwt');

        if (!token) {
            console.error('No JWT token found');
            // Router.navigate(['/login']);
           return null;
        }
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    
       return headers;
            
    }

    getPendingReports() {
        const getTokern = this.getTokern();
        return this.http.get<Report[]>(`${this.API_URL}/reports/pending`, { headers: getTokern! });
    }

    getAllUsers(page: number = 0, size: number = 50) {
        const getTokern = this.getTokern();
        return this.http.get<User[]>(`${this.API_URL}/users?page=${page}&size=${size}`, { headers: getTokern! });
    }

    getAllPosts(page: number = 0, size: number = 50){
        const getTokern = this.getTokern();
        return this.http.get<Post[]>(`${this.API_URL}/posts?page=${page}&size=${size}`, { headers: getTokern! });
    }

    banUser(userId: number) {
        const getTokern = this.getTokern();
        return this.http.post(`${this.API_URL}/users/${userId}/ban`, { headers: getTokern! });
    }

    unbanUser(userId: number) {
        const getTokern = this.getTokern();
        return this.http.post(`${this.API_URL}/users/${userId}/unban`, { headers: getTokern! });
    }

    deleteUser(userId: number) {
        const getTokern = this.getTokern();
        return this.http.delete(`${this.API_URL}/users/${userId}`, { headers: getTokern! });
    }

    hidePost(postId: number, reason: string) {
        const getTokern = this.getTokern();
        return this.http.post(`${this.API_URL}/posts/${postId}/hide`,  { reason }, { headers: getTokern! });
    }

    unhidePost(postId: number) {
        const getTokern = this.getTokern();
        return this.http.post(`${this.API_URL}/posts/${postId}/unhide`, { headers: getTokern! });
    }

    deletePost(postId: number) {
        const getTokern = this.getTokern();
        return this.http.delete(`${this.API_URL}/posts/${postId}`, { headers: getTokern! });
    }

    resolveReport(reportId: number, adminNote: string, adminId: number) {
        return this.http.post(`${this.API_URL}/reports/${reportId}/resolve`, {
            adminNote,
            adminId: adminId.toString()
        });
    }
}