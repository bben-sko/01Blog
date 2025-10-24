import { Component, OnInit } from '@angular/core';
import { Post } from '../shered/posts/posts';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../sevice/post.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-singlepost',
  imports: [],
  templateUrl: './singlepost.html',
  styleUrl: './singlepost.css'
})

interface CreateCommentRequest {
  content: string,
  postId: number
}

export class Singlepost implements OnInit {
  post: Post | null = null;
  showMenu: boolean = false;
  showComments: boolean = true;
  newComment: string = '';
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private http: HttpClient,
    // private commentService: CommentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      this.loadPost(postId);
    });
  }

  loadPost(postId: number) {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.router.navigate(['/home']);
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

  toggleLike() {
    if (!this.post) return;

    // Call your like service
    console.log('Toggle like for post:', this.post.id);
    this.post.isLiked = !this.post.isLiked;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
    if (!this.post || !this.newComment.trim() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const request: CreateCommentRequest = {
      content: this.newComment,
      postId: this.post.id
    }
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post("http://localhost:8080/api/post/home", { headers }, { request } ).subscribe({
      next: (comment) => {
        console.log('Comment added:', comment);
        this.newComment = '';
        this.isSubmitting = false;
        this.loadPost(this.post!.id);
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.isSubmitting = false;
      }
    });
  }
}
