import { Component, OnInit } from '@angular/core';

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../sevice/adminservice';



export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPosts: number;
  activePosts: number;
  hiddenPosts: number;
  deletedPosts: number;
  pendingReports: number;
  resolvedReports: number;
}

export interface Report {
  id: number;
  postId: number;
  postContent: string;
  postImageUrl: string;
  reporterId: number;
  reporterUsername: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  adminNote: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  status: string;
  createdAt: string;
  bannedAt?: string;
  banReason?: string;
}

export interface Post {
  id: number;
  userId: number;
  username: string;
  content: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  hiddenAt?: string;
  hiddenReason?: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
@Injectable({
  providedIn: 'root'
})
export class Admin implements OnInit {

  private adminService = inject(AdminService);

  stats: DashboardStats | null = null;
  users: User[] = [];
  posts: Post[] = [];

  activeTab: 'reports' | 'users' | 'posts' = 'reports';

  selectedReport: Report | null = null;
  selectedUser: User | null = null;
  selectedPost: Post | null = null;

  actionReason = '';
  adminNote = '';
  adminId = 1; // Should come from auth service

  loading = false;
  error = '';

  ngOnInit() {
   
  }

 

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  loadPosts() {
    this.loading = true;
    this.adminService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.error = 'Failed to load posts';
        this.loading = false;
      }
    });
  }

  switchTab(tab: 'reports' | 'users' | 'posts') {
    this.activeTab = tab;
    this.error = '';

    if (tab === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (tab === 'posts' && this.posts.length === 0) {
      this.loadPosts();
    } 
  }

  banUser(user: User) {
    

    this.adminService.banUser(user.id).subscribe({
      next: () => {
        alert('User banned successfully');
        this.actionReason = '';
        this.selectedUser = null;
        this.loadUsers();
      },
      error: (err) => console.error('Failed to ban user:', err)
    });
  }

  unbanUser(user: User) {
    if (!confirm('Are you sure you want to unban this user?')) return;

    this.adminService.unbanUser(user.id).subscribe({
      next: () => {
        alert('User unbanned successfully');
        this.loadUsers();
      },
      error: (err) => alert('Failed to unban user: ' + (err.error || err.message))
    });
  }

  deleteUser(userId: number) {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.loadUsers();
      },
      error: (err) => alert('Failed to delete user: ' + (err.error || err.message))
    });
  }

  hidePost(post: Post) {
    if (!this.actionReason.trim()) {
      alert('Please provide a reason');
      return;
    }

    this.adminService.hidePost(post.id, this.actionReason).subscribe({
      next: () => {
        alert('Post hidden successfully');
        this.actionReason = '';
        this.selectedPost = null;
        this.loadPosts();
      },
      error: (err) => alert('Failed to hide post: ' + (err.error || err.message))
    });
  }

  unhidePost(postId: number) {
    if (!confirm('Are you sure you want to unhide this post?')) return;

    this.adminService.unhidePost(postId).subscribe({
      next: () => {
        alert('Post unhidden successfully');
        this.loadPosts();
      },
      error: (err) => alert('Failed to unhide post: ' + (err.error || err.message))
    });
  }

  deletePost(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.adminService.deletePost(postId).subscribe({
      next: () => {
        alert('Post deleted successfully');
        this.loadPosts();
        if (this.selectedReport) {
          this.closeModal();
        }
      },
      error: (err) => alert('Failed to delete post: ' + (err.error || err.message))
    });
  }

  resolveReport(report: Report) {
    if (!this.adminNote.trim()) {
      alert('Please provide an admin note');
      return;
    }

    this.adminService.resolveReport(report.id, this.adminNote, this.adminId).subscribe({
      next: () => {
        alert('Report resolved successfully');
        this.adminNote = '';
        this.selectedReport = null;
       
      },
      error: (err) => alert('Failed to resolve report: ' + (err.error || err.message))
    });
  }

  openReportModal(report: Report) {
    this.selectedReport = report;
    this.adminNote = '';
  }

  openBanUserModal(user: User) {
    this.selectedUser = user;
    this.actionReason = '';
  }

  openHidePostModal(post: Post) {
    this.selectedPost = post;
    this.actionReason = '';
  }

  closeModal() {
    this.selectedReport = null;
    this.selectedUser = null;
    this.selectedPost = null;
    this.actionReason = '';
    this.adminNote = '';
  }

  hidePostFromReport(postId: number) {
    if (!this.actionReason.trim()) {
      this.actionReason = 'Reported content violation';
    }

    this.adminService.hidePost(postId, this.actionReason).subscribe({
      next: () => {
        alert('Post hidden successfully');
        this.actionReason = '';
      },
      error: (err) => alert('Failed to hide post: ' + (err.error || err.message))
    });
  }

  deletePostFromReport(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.adminService.deletePost(postId).subscribe({
      next: () => {
        alert('Post deleted successfully');
      },
      error: (err) => alert('Failed to delete post: ' + (err.error || err.message))
    });
  }
}