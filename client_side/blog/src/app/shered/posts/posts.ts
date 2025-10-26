import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// post.interface.ts
export interface Post {
  postId: number;
  avatar?: string;
  content: string;
  media: string[];
  comments: Comment[];
  username: string;
  createdAt: Date;
  updatedAt: Date;
  likedByUser: boolean;  // Changed from isLiked
  ismy: boolean;  // New field - indicates if post belongs to current user
}

export interface Comment {
  id: number;
  username: string;
  avatar?: string;
  content: string;
  time: Date;
}
export interface CreatePost {
  content: string;
  media: String[];
}


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.html',
  styleUrls: ['./posts.css'],
})
export class Posts {
  @Input() post!: Post;
  showComments = false;
  showMenu = false;
  newComment = '';

  constructor(private router: Router, private http: HttpClient) {
  }


  toggleLike() {
    if (this.post.likedByUser) {
      this.unlike(this.post.postId)


    } else {
      this.like(this.post.postId)
    }
    this.post.likedByUser = !this.post.likedByUser;
  }
  like(postId: number) {
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('postId', postId);
    this.http.post(`/api/likes`, headers, { params });
  }
  unlike(postId: number) {
       const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('postId', postId);
    this.http.delete(`/api/likes`,{headers ,params });
  }
  toggleComments() {
    this.showComments = !this.showComments;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  addComment() { }
  //   if (this.newComment.trim()) {
  //     const comment: Comment = {
  //       id: this.post.comments.length + 1,
  //       username: 'Current User',
  //       content: this.newComment,
  //       timestamp: new Date()
  //     };
  //     this.post.comments.push(comment);
  //     this.newComment = '';
  //   }
  // }

  reportPost(reason: string) {
    console.log(`Post reported for: ${reason}`);
    this.showMenu = false;
    // Add your report logic here
  }

  closeMenu() {
    this.showMenu = false;
  }

  getMoreInfo(postid: number) {
    console.log(postid)
    this.router.navigate([`/post/${postid}`])
  }
}
