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
type Preview = { url: string; type: string; file: File };

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
  converteToEdit: boolean = false;
  submitting: boolean = false;
  files: File[] = [];
  previews: Preview[] = [];
  newcontent = this.post?.content;
  postErr: string = "";
 

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
  async loadPostToEdit() {
    this.newcontent = this.post?.content
    await this.loadExistingImages(this.post?.media)
  }
  deletePost() {
    if (!this.post) return;
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.delete(`http://localhost:8080/api/post/${this.post.postId}`, { headers }).subscribe({
      next:() => {
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err)
      }
    })
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
    this.http.get(`http://localhost:8080/api/comments/${postId}`, { headers }).subscribe({
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
  }

  async edit() {
    this.converteToEdit = !this.converteToEdit;
    
    await this.loadPostToEdit();
   
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

  reportPost() {
    this.showReportModal = !this.showReportModal;
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
  submitReport() {
    if (this.reportSubmitted || !this.reportText.trim()) {
      return;
    }
    if (!this.reportText.trim()) {
      return;
    }
    this.reportSubmitted = true;

    localStorage.getItem('jwt');
    let token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post(`http://localhost:8080/api/reports/add`, {
      reason: this.reportText,
      postId: this.post?.postId
    }, { headers }).subscribe({
      next: () => {
        console.log('Report submitted');
        this.reportText = '';
        this.reportSubmitted = false;
        this.showReportModal = false;
        this.cdr.detectChanges();

      },
      error: (error) => {
        this.reportSubmitted = false;
        this.showReportModal = false;
        this.reportText = '';
        this.cdr.detectChanges();

      }
    });

  }
  closeReportModal() { }
  openReportModal() { }
  async loadExistingImages(imageUrls: string[]| undefined) {
    if (imageUrls == undefined || this.previews.length > 0) return;
    
    for (const url of imageUrls) {
      try {
        // Fetch the image from your backend
        const response = await fetch(url);
        const blob = await response.blob();

        // Extract filename from URL
        // e.g., "77186d0c-923d-4cfa-99c4-200c7451fa69.png"
        const filename = url.split('/').pop() || 'image.png';

        // Convert blob to File object
        const file = new File([blob], filename, { type: blob.type });

        // Add to your existing arrays (same as your onFilesSelected does)
        this.files.push(file);
        this.previews.push({
          url: url, // Use the original URL for preview
          type: blob.type,
          file: file
        });
      } catch (error) {
        console.error(`Failed to load image: ${url}`, error);
      }
    }
  }

  onFilesSelected(evt: Event, kind: 'image' | 'video') {
    const input = evt.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((f) => {
      if (kind === 'image' && !f.type.startsWith('image/')) return;
      if (kind === 'video' && !f.type.startsWith('video/')) return;

      this.files.push(f);
      this.previews.push({ url: URL.createObjectURL(f), type: f.type, file: f });
    });

    input.value = '';
  }

  removeAt(i: number) {
    const p = this.previews[i];
    if (p) URL.revokeObjectURL(p.url);
    this.previews.splice(i, 1);
    this.files.splice(i, 1);
  }

}
