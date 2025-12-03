import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

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
    imageUrl?: string;
    enable: boolean;
    createdAt: string;
    hiddenAt?: string;
    hiddenReason?: string;
}

export interface Report {
    id: number;
    postId: number;
    postContent: string;
    postEnabled: boolean;
    reporterId: number;
    reporterUsername: string;
    reason: string;
    description: string;
    status: ReportStatus;
    createdAt: string;
    resolvedAt?: string;
    adminNote?: string;
    resolvedBy?: string;
}

export interface ProfileReport {
    id: number;
    reporterUsername: string;
    reportedUsername: string;
    reason: string;
    createdAt: string;
}

export interface AdminDashboardData {
    stats: DashboardStats;
    postReports: Report[];
    profileReports: ProfileReport[];
    users: User[];
    posts: Post[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private API_URL = 'http://localhost:8080/api/admin';
    private API_REPORT_URL = 'http://localhost:8080/api/reports';

    getDashboardStats(): Observable<DashboardStats> {
        const token = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`, { headers });
    }

    getDashboard(page: number = 0, size: number = 50): Observable<AdminDashboardData> {
        const token = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<AdminDashboardData>(`${this.API_URL}/dashboard?page=${page}&size=${size}`, { headers });
    }

    getTokern(): string  {
        const token = localStorage.getItem('jwt');

        if (!token) {
            console.error('No JWT token found');
            // Router.navigate(['/login']);
           return "";
        }
       
    
        return token;
            
    }

    getAllUsers(page: number = 0, size: number = 50) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.get<User[]>(`${this.API_URL}/users?page=${page}&size=${size}`, {  headers });
    }

    getAllPosts(page: number = 0, size: number = 50){
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.get<Post[]>(`${this.API_URL}/posts?page=${page}&size=${size}`, {  headers });
    }

    banUser(userId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        console.log(getTokern)
        return this.http.post(`${this.API_URL}/users/${userId}/ban`, {}, {  headers });
    }

    unbanUser(userId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.post<string>(`${this.API_URL}/users/${userId}/unban`,  {}, {  headers });
    }

    deleteUser(userId: number) {
        const getTokern = this.getTokern();
        if (!getTokern) {
            throw new Error('No JWT token found');
        }
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.delete(`${this.API_URL}/users/${userId}`, { headers });
    }

    hidePost(postId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.post(`${this.API_URL}/posts/${postId}/hide`, {},{  headers });
    }

    unhidePost(postId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.post(`${this.API_URL}/posts/${postId}/unhide`, {},{  headers });
    }

    deletePost(postId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.delete(`${this.API_URL}/posts/${postId}`, {  headers });
    }

    getReports(status: 'ALL' | ReportStatus = 'ALL') {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        const query = status ? `?status=${status}` : '';
        return this.http.get<Report[]>(`${this.API_REPORT_URL}/all${query}`, { headers });
    }

    resolveReport(reportId: number, payload: { status: ReportStatus; adminNote: string; hidePost: boolean; }) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.put(`${this.API_REPORT_URL}/${reportId}`, payload, { headers });
    }
    getReportById(reportId: number) {
        const getTokern = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${getTokern}`
        });
        return this.http.get<Report>(`${this.API_REPORT_URL}/${reportId}`, {  headers });
    }

    getProfileReports() {
        const token = this.getTokern();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ProfileReport[]>(`http://localhost:8080/api/profile-reports`, { headers });
    }
}
