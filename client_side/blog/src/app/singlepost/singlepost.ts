import { ChangeDetectorRef, Component, HostListener, OnInit, inject } from '@angular/core';
import { Post } from '../shered/posts/posts';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../sevice/post.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationDialog } from '../shered/confirm-dialog/confirm-dialog';
import { FeedbackService } from '../shered/feedback/feedback.service';

interface CreateCommentRequest {
  content: string,
  postId: number
}

interface Comment {
  id: number;
  content: string;
  username: string;
  userId: number;
  avatar?: string;
  time: string;
}

interface CommentApiResponse {
  comments: Comment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
type Preview = { url: string; type: string; file?: File; existing?: boolean };

interface RelatedArticleCard {
  postId: number;
  title: string;
  username: string;
  coverImage: string;
  readingTime: string;
  createdAt: Date;
}

@Component({
  selector: 'app-singlepost',
  imports: [CommonModule, FormsModule, ConfirmationDialog],
  templateUrl: './singlepost.html',
  styleUrl: './singlepost.css'
})


export class Singlepost implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  commentPage = 0;
  commentPageSize = 2;
  hasMoreComments = true;
  loadingComments = false;
  postLoadError: string | null = null;
  currentUserId: number | null = null;
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
  existingMedia: string[] = [];
  articleReadingTime = '';
  articleCategory = 'Feature';
  articleParagraphs: string[] = [];
  featuredQuote = '';
  articleHeroImage = '';
  readProgress = 0;
  dialogOpen = false;
  dialogTitle = '';
  dialogMessage = '';
  dialogDescription = '';
  private dialogAction: () => void = () => { };
  private feedback = inject(FeedbackService);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initCurrentUserId();
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      this.loadPost(postId);
    });
  }

 

  private initCurrentUserId() {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = Number(payload.id);
    } catch (err) {
      console.error('Failed to decode JWT payload', err);
    }
  }
  async loadPostToEdit() {
    if (!this.post) {
      return;
    }
    this.newcontent = this.post.content;
    this.previews = [];
    this.files = [];
    this.existingMedia = [];
    await this.loadExistingImages(this.post.media);
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
      next: () => {
        this.feedback.success('Post deleted');
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err)
        this.feedback.error('Failed to delete post');
      }
    })
  }
  loadcomments(postId: number, reset: boolean = false) {
    if (this.postLoadError) {
      return;
    }
    if (this.loadingComments) {
      return;
    }
    if (reset) {
      this.commentPage = 0;
      this.comments = [];
      this.hasMoreComments = true;
    } else if (!this.hasMoreComments) {
      return;
    }
    this.loadingComments = true;
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.loadingComments = false;
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams()
      .set('page', this.commentPage)
      .set('size', this.commentPageSize);
    this.http.get<CommentApiResponse>(`http://localhost:8080/api/comments/${postId}`, { headers, params }).subscribe({
      next: (response) => {
        const fetched = response.comments.map(c => ({
          id: c.id,
          content: c.content,
          username: c.username,
          userId: c.userId,
          avatar: c.avatar,
          time: c.time,
        }));
        this.comments = [...this.comments, ...fetched];
        this.hasMoreComments = !response.last;
        this.commentPage = response.page + 1;
        this.loadingComments = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loadingComments = false;
      }
    });
    this.cdr.detectChanges();
  }

  loadMoreComments() {
    if (!this.post) {
      return;
    }
    this.loadcomments(this.post.postId);
  }
  editPost() {
    if (!this.post) return;
  }

  deleteComment(comment: Comment) {
    if (comment.userId !== this.currentUserId) {
      return;
    }
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.openConfirm('Delete Comment', 'Are you sure you want to delete this comment?', '', () => {
      this.http.delete(`http://localhost:8080/api/comments/${comment.id}`, { headers }).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== comment.id);
          this.cdr.detectChanges();
          this.feedback.success('Comment deleted');
        },
        error: (error) => {
          console.error('Failed to delete comment', error);
          this.feedback.error('Failed to delete comment');
        }
      });
    });
  }

  openConfirm(title: string, message: string, description: string, action: () => void) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogDescription = description;
    this.dialogAction = action;
    this.dialogOpen = true;
  }

  confirmDialog() {
    this.dialogAction();
    this.dialogOpen = false;
  }

  cancelDialog() {
    this.dialogOpen = false;
  }

  async edit() {
    this.converteToEdit = !this.converteToEdit;
    this.postErr = '';
    if (this.converteToEdit) {
      await this.loadPostToEdit();
      this.cdr.detectChanges();
    } else {
      this.previews = [];
      this.files = [];
      this.existingMedia = [];
    }
  }

  loadPost(postId: number) {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.postLoadError = null;
        this.articleHeroImage = this.resolveHeroImage(post);
        this.articleReadingTime = this.calculateReadingTime(post.content);
        this.articleParagraphs = this.segmentContent(post.content);
        this.featuredQuote = this.extractQuote(post.content);
        this.loadcomments(postId, true);
        this.updateProgress();
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (error.status === 404) {
          this.postLoadError = 'Post not found or has been removed.';
        } else {
          this.postLoadError = 'Unable to load this post right now.';
        }
        this.post = null;
        this.comments = [];
        this.hasMoreComments = false;
        this.cdr.detectChanges();
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
    this.showReportModal = true;
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
        this.newComment = '';
        this.isSubmitting = false;
        if (this.post) {
          this.loadcomments(this.post.postId, true);
        }
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
    this.openConfirm('Report Post', 'Are you sure you want to Report this post?', '', () => {
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
          console.error('Error submitting report:', error);
          this.reportSubmitted = false;
          this.showReportModal = false;
          this.reportText = '';
          this.cdr.detectChanges();

        }
      });
    })
  }
  closeReportModal() {
    this.showReportModal = false;
    this.reportText = '';
  }
  openReportModal() {
    this.showReportModal = true;
  }
  async loadExistingImages(imageUrls: string[] | undefined) {
    if (!imageUrls || imageUrls.length === 0) {
      return;
    }

    for (const url of imageUrls) {
      try {
        const response = await fetch(url); // RxJs
        const blob = await response.blob();

        this.existingMedia.push(url);
        this.previews.push({
          url,
          type: blob.type,
          existing: true
        });
      } catch (error) {
        console.error(`Failed to load image: ${url}`, error);
      }
    }
  }

  private resolveHeroImage(post: Post) {
    return (post.media && post.media[0]) || `https://source.unsplash.com/collection/190727/1400x900?sig=${post.postId}`;
  }

  private calculateReadingTime(content?: string) {
    if (!content) {
      return '1 min read';
    }
    const words = content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  private segmentContent(content?: string) {
    if (!content) {
      return [];
    }
    return content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  }

  private extractQuote(content?: string) {
    if (!content) {
      return '';
    }
    const sentences = content.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 40);
    return sentences[0] || content.substring(0, 140);
  }



  private updateProgress() {
    if (typeof document === 'undefined') {
      return;
    }
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    this.readProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  }

  onFilesSelected(evt: Event, kind: 'image' | 'video') {
    const input = evt.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((f) => {
      if (kind === 'image' && !f.type.startsWith('image/')) return;
      if (kind === 'video' && !f.type.startsWith('video/')) return;

      this.files.push(f);
      this.previews.push({ url: URL.createObjectURL(f), type: f.type, file: f, existing: false });
    });

    input.value = '';
  }

  removeAt(i: number) {
    const p = this.previews[i];
    if (!p) {
      return;
    }

    if (!p.existing && p.file) {
      const fileIndex = this.files.indexOf(p.file);
      if (fileIndex !== -1) {
        this.files.splice(fileIndex, 1);
      }
      URL.revokeObjectURL(p.url);
    }

    if (p.existing) {
      this.existingMedia = this.existingMedia.filter((url) => url !== p.url);
    }

    this.previews.splice(i, 1);
  }

  submitUpdate() {
    if (!this.post) {
      return;
    }

    const trimmedContent = (this.newcontent || '').trim();
    if (!trimmedContent && this.existingMedia.length === 0 && this.files.length === 0) {
      this.postErr = 'Please add some content or media to update the post.';
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // interceptor and wraping data by a bearer token
    });

    const fd = new FormData();
    fd.append('content', trimmedContent);
    this.existingMedia.forEach((url) => fd.append('existingMedia', url));
    this.files.forEach((file) => fd.append('files', file));

    this.submitting = true;
    this.http.post(`http://localhost:8080/api/post/${this.post.postId}`, fd, { headers }).subscribe({
      next: () => {
        this.submitting = false;
        this.converteToEdit = false;
        this.previews = [];
        this.files = [];
        this.existingMedia = [];
        this.loadPost(this.post!.postId);
      },
      error: (err) => {
        this.submitting = false;
        this.postErr = err?.error?.message || 'Failed to update post';
      }
    });
  }

}
