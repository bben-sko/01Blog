import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { Post, Posts } from '../shered/posts/posts';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-home',
  imports: [NavBar, Posts],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
 posts: Post[] = [];
 page = 0;
 pageSize = 3;
 hasMore = true;
 loading = false;

ngOnInit(): void {
    this.loadPosts(true);
}
  constructor(
    private http: HttpClient, private cdr: ChangeDetectorRef){}
loadPosts(reset = false) {
  if (reset) {
    this.posts = [];
    this.page = 0;
    this.hasMore = true;
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
        this.hasMore = fetched.length === this.pageSize;
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
  if (this.loading || !this.hasMore) return;
  this.page += 1;
  this.loadPosts();
}

}
