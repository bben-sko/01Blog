import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../home/posts/posts';
import { NavBar } from '../home/nav-bar/nav-bar';


@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule,NavBar],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css'
})
export class NewPost {
  postContent: string = '';
  selectedImage: string | null = null;
  selectedVideo: string | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;

  constructor(private router: Router) {}

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
      alert('Please add some content to your post');
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      username: 'Current User',
      userAvatar: 'https://img.freepik.com/free-photo/starry-clear-sky-view-with-nature-landscape_23-2151683112.jpg?ga=GA1.1.1543395655.1759957868&semt=ais_hybrid&w=740&q=80',
      timestamp: new Date(),
      content: this.postContent,
      imageUrl: this.imagePreview || undefined,
      videoUrl: this.videoPreview || undefined,
      likes: 0,
      comments: [],
      isLiked: false
    };

    // Here you would typically send this to your backend service
    console.log('New post created:', newPost);
    
    // Navigate back to home
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
