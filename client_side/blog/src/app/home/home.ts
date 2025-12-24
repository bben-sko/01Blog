import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Post } from '../shered/posts/posts';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const MEDIA_PLACEHOLDER = "avatar-default.jpeg";

interface EnrichedPost extends Post {
  coverImage: string;
  excerpt: string;
  readingTime: string;
  publishedAt: Date;
}


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  posts: Post[] = [];
  page = 0;
  pageSize = 6;
  hasMore = true;
  loading = false;
  readonly baseVisible = 6;
  visibleCount = this.baseVisible;
  today = new Date();

  ngOnInit(): void {

    this.loadPosts();
  }
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  loadPosts() {

    const token = localStorage.getItem('jwt');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams()
      .set('page', this.page)
      .set('size', this.pageSize);
    this.loading = true;
    this.http.get("http://localhost:8080/api/post/home", { headers, params }).subscribe(
      (data) => {
        if ((data as Post[]).length === 0 || (data as Post[]).length < this.pageSize) {
          this.hasMore = false;
        }
        this.posts = this.mergeUniquePosts(this.posts, data as Post[]);


        this.loading = false;
        this.cdr.detectChanges();

      },
      (error) => {
        this.loading = false;
      }
    )
  }

  mergeUniquePosts(
    existing: Post[],
    incoming: Post[]
  ): Post[] {
    const map = new Map<number | string, Post>();

    existing.forEach(post => map.set(post.postId, post));
    incoming.forEach(post => map.set(post.postId, post));

    return Array.from(map.values());
  }

  showMore() {
    this.loadMoreStories();
  }






  loadMoreStories() {
    if (this.loading) {
      return;
    }


    if (this.hasMore) {

      this.visibleCount += this.pageSize;
      this.page += 1;
      this.loadPosts();
    }
  }

  viewPost(post: Post) {
    this.router.navigate(['/post', post.postId]);
  }

  scrollToTop() {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
