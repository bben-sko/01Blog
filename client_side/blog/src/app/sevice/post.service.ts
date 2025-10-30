// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../shered/posts/posts';


@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:8080/api/post';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getPostById(postId: number): Observable<Post> {
        const headers = this.getAuthHeaders();
        return this.http.get<Post>(`${this.apiUrl}/${postId}`, { headers });
    }

    getcommentById(postId: number) {
        return this.http.get<any>(`http://localhost:8080/api/comments/${postId}`);
    }

    
}
