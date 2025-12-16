import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Post } from '../shered/posts/posts';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

const MEDIA_PLACEHOLDER = "avatar-default.jpeg";

interface EnrichedPost extends Post {
  coverImage: string;
  excerpt: string;
  readingTime: string;
  views: number;
  popularityScore: number;
  publishedAt: Date;
}


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
 posts: Post[] = [];
 enrichedPosts: EnrichedPost[] = [];
 filteredPosts: EnrichedPost[] = [];
 displayedPosts: EnrichedPost[] = [];
 featuredPost: EnrichedPost | null = null;
 page = 0;
 pageSize = 6;
 hasMore = true;
 loading = false;
 globalSearchTerm = '';
 readonly baseVisible = 6;
 visibleCount = this.baseVisible;
  today = new Date();
  private subscriptions = new Subscription();

ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.globalSearchTerm = params['search'] || '';
        this.applyFilters(true);
      })
    );
    this.loadPosts(true);
}
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ){}

ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
}
loadPosts(reset = false) {
  if (reset) {
    this.posts = [];
    this.enrichedPosts = [];
    this.filteredPosts = [];
    this.displayedPosts = [];
    this.page = 0;
    this.hasMore = true;
    this.visibleCount = this.baseVisible;
  }
  const token = localStorage.getItem('jwt');

  if (!token) {
    console.error('No JWT token found');
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
        const fetched = data as Post[];
        this.posts = [...this.posts, ...fetched];
        const offset = this.enrichedPosts.length;
        const mapped = fetched.map((post, index) => this.enrichPost(post, offset + index));
        this.enrichedPosts = [...this.enrichedPosts, ...mapped];
        this.hasMore = fetched.length === this.pageSize;
        this.refreshCollections(!reset);
        this.loading = false;
      this.cdr.detectChanges();

     },
     (error) => {
      console.log(error);
      this.loading = false;
     }
  )
}

showMore() {
  this.loadMoreStories();
}

  private refreshCollections(preserveVisible: boolean) {
    this.featuredPost = this.pickFeaturedPost();
    this.applyFilters(!preserveVisible);
  }

  private enrichPost(post: Post, index: number): EnrichedPost {
    const safeContent = post.content || '';
    const words = safeContent.split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.round(words / 200))} min read`;
    const coverImage = (post.media && post.media[0]) || post.avatar || MEDIA_PLACEHOLDER;
    const excerpt = safeContent.substring(0, 180).concat(safeContent.length > 180 ? '…' : '');
    const views = 400 + ((post.postId || index) * 37) % 2400;
    const popularityScore = views + (post.comments?.length || 0) * 12 + (post.likedByUser ? 25 : 0);
    const publishedAt = post.createdAt ? new Date(post.createdAt) : new Date();
    return {
      ...post,
      coverImage,
      excerpt,
      readingTime,
      views,
      popularityScore,
      publishedAt
    };
 }

  private pickFeaturedPost(): EnrichedPost | null {
    if (!this.enrichedPosts.length) {
      return null;
    }
    return [...this.enrichedPosts].sort((a, b) => b.views - a.views)[0];
  }

  applyFilters(resetVisible = false) {
    if (resetVisible) {
      this.visibleCount = this.baseVisible;
    }
    const term = this.globalSearchTerm.trim().toLowerCase();
    this.filteredPosts = this.enrichedPosts.filter((post) => {
      return !term || post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term);
    });

    this.filteredPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    this.displayedPosts = this.filteredPosts.slice(0, this.visibleCount);
  }

  loadMoreStories() {
    if (this.loading) {
      return;
    }

    if (this.displayedPosts.length < this.filteredPosts.length) {
      this.visibleCount += this.pageSize;
      this.displayedPosts = this.filteredPosts.slice(0, this.visibleCount);
      return;
    }

    if (this.hasMore) {
      this.visibleCount += this.pageSize;
      this.page += 1;
      this.loadPosts();
    }
 }

 viewPost(post: EnrichedPost) {
    this.router.navigate(['/post', post.postId]);
 }

 scrollToTop() {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
 }

}
