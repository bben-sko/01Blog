import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { Post, Posts } from '../shered/posts/posts';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from 'console';


@Component({
  selector: 'app-home',
  imports: [NavBar, Posts],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
 posts: Post[] | null = null ;

ngOnInit(): void {
    this.loadPosts();
}
  constructor(private route: ActivatedRoute,
    private routenav: Router,
    private http: HttpClient, private cdr: ChangeDetectorRef){}
loadPosts() {
  const token = localStorage.getItem('jwt');
  console.log('Loading profile for:', token);

  if (!token) {
    console.error('No JWT token found');
    return;
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  this.http.get("http://localhost:8080/api/post/home", { headers }).subscribe(
     (data) => {
        console.log(data)
        this.posts = (data as any) ;
        console.log(this.posts);
      this.cdr.detectChanges();

     },
     (error) => {
      console.log(error)
     }
  )
}

}
