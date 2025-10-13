import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Post {
  id: number;
  username: string;
  timestamp: Date;
  content: string;
  userAvatar: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
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
  

 

  toggleLike() {
    this.post.isLiked = !this.post.isLiked;
    this.post.likes += this.post.isLiked ? 1 : -1;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: this.post.comments.length + 1,
        username: 'Current User',
        content: this.newComment,
        timestamp: new Date()
      };
      this.post.comments.push(comment);
      this.newComment = '';
    }
  }

  reportPost(reason: string) {
    console.log(`Post reported for: ${reason}`);
    this.showMenu = false;
    // Add your report logic here
  }

  closeMenu() {
    this.showMenu = false;
  }
}
