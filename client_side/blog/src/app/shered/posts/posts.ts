import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// post.interface.ts
export interface Post {
  id: number;
  content: string;
  media: string[];  // Array of media URLs (images/videos)
  comments: Comment[];
  username: string;
  timestamp: Date;
  videoUrl: string;
  imageUrl: string;
  updatedAt: Date;
  isLiked: boolean;  // Changed from isLiked
  ismy: boolean;  // New field - indicates if post belongs to current user
}

export interface CreatePost {
  content: string;
  media: String[];
}

export interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.html',
  styleUrls: ['./posts.css'],
})
export class Posts {
  @Input() post!: Post;
  showComments = false;
  showMenu = false;
  newComment = '';
  
constructor() {
  console.log(this.post);
}
 

  toggleLike() {
    this.post.isLiked = !this.post.isLiked;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  addComment() {}
  //   if (this.newComment.trim()) {
  //     const comment: Comment = {
  //       id: this.post.comments.length + 1,
  //       username: 'Current User',
  //       content: this.newComment,
  //       timestamp: new Date()
  //     };
  //     this.post.comments.push(comment);
  //     this.newComment = '';
  //   }
  // }

  reportPost(reason: string) {
    console.log(`Post reported for: ${reason}`);
    this.showMenu = false;
    // Add your report logic here
  }

  closeMenu() {
    this.showMenu = false;
  }
}
