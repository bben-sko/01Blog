import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { CreatePost, Post } from '../shered/posts/posts';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBar],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css'
})


export class NewPost {
  postContent: string = '';
  postErr: string = '';
  selectedImage: string | null = null;
  selectedVideo: string | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  private http = inject(HttpClient);

  constructor(private router: Router) { }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedImage = null;
  }

  removeVideo() {
    this.videoPreview = null;
    this.selectedVideo = null;
  }

  createPost() {

    if (!this.postContent.trim() && !this.imagePreview && !this.videoPreview) {
      this.postErr = "Please add some content to your post"
      return
    }
    
    const newPost: CreatePost = {
      content: this.postContent,
      media: [],
    };
    const token = localStorage.getItem('jwt');
    console.log(token)
    if (token === null) {
      this.router.navigate(['/login']);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post("http://localhost:8080/api/post/createpost", newPost, { headers }).subscribe({
      next: (response) => {
        this.router.navigate(['/']);

      },
      error: (e) => {
        console.log(e)
        this.postErr = e.err;
      }
    })
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
