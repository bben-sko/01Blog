import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../shered/posts/posts';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../sevice/post.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavBar } from '../shered/nav-bar/nav-bar';

interface CreateCommentRequest {
  content: string,
  postId: number
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  username: number;
  avatar?: string;
  time: Date;
}
@Component({
  selector: 'app-singlepost',
  imports: [CommonModule, FormsModule, NavBar],
  templateUrl: './singlepost.html',
  styleUrl: './singlepost.css'
})


export class Singlepost implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  showMenu: boolean = false;
  showComments: boolean = true;
  newComment: string = '';
  isSubmitting: boolean = false;
  reportText: string = '';
  reportSubmitted: boolean = false;
  showReportModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      this.loadPost(postId);
      this.loadcomments(postId);
    });
  }

  deletePost() {
    if (!this.post) return;

  }
  loadcomments(postId: number) {
     const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
     this.http.get(`http://localhost:8080/api/comments/${postId}`,  { headers } ).subscribe({
      next: (comment) => {
        console.log(comment);
      
        this.comments = comment as Comment[]; 
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading post:', error);
      }
    });
     this.cdr.detectChanges();
  }
  editPost() {
    if (!this.post) return;
    // this.router.navigate(['/edit-post', this.post.postId]);
  }

  loadPost(postId: number) {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        console.log(post);
        this.post = post;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading post:', error);
      }
    });


  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  reportPost(type: string) {
    console.log(`Reporting post as: ${type}`);
    // Implement report functionality
    this.closeMenu();
  }
  goBack() {
    this.router.navigate(['/']);
  }
 
  toggleLike(postId: number) {
    if (!this.post) return;

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('postId', postId);
    if (this.post.likedByUser) {
      this.http.delete(`http://localhost:8080/api/likes`, { headers, params })
        .subscribe({
          next: () => {
            console.log('Post unliked');
          },
          error: (error) => {
            console.error('Error unliking post:', error);
          }
        });
    } else {

      this.http.post(`http://localhost:8080/api/likes`, null, { headers, params })
        .subscribe({
          next: () => {
            console.log('Post liked');
          },
          error: (error) => {
            console.error('Error liking post:', error);
          }
        });
    }
    this.post.likedByUser = !this.post.likedByUser;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment(postId: number) {
    if (!this.post || !this.newComment.trim() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const request: CreateCommentRequest = {
      content: this.newComment,
      postId: this.post.postId
    }
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post(`http://localhost:8080/api/comments`, request, { headers },).subscribe({
      next: (comment) => {
        console.log('Comment added:', comment);
        this.newComment = '';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.isSubmitting = false;
      }
    });
    this.cdr.detectChanges();
  }
  submitReport(){}
  closeReportModal() {}
  openReportModal(){}
}
