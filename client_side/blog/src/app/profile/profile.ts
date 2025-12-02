import { ChangeDetectorRef, Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, Posts, } from '../shered/posts/posts';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { Users, UsersList } from '../shered/add-user/users-list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



export interface User {
  id: number ;
  username: string;
  avatar?: string;
  bio?: string;
  isme: boolean;
  isFollowing?: boolean;
  avatarUrl?: string;
}

export interface FollowUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
  isme?: boolean;
}


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavBar, RouterModule, Posts, FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user!: User;
  activeTab: 'posts' | 'followers' | 'following' = 'posts';
  username: string | null = null;
  userPosts: Post[] = [];
  followers: FollowUser[] = [];
  following: FollowUser[] = [];
  reportModalOpen = false;
  reportReason = '';
  reportError = '';
  
  // loading = false;

  constructor(
    private route: ActivatedRoute,
    private routenav: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if(typeof window !== 'undefined'){
      console.log('Window is defined');
    }
   
  }
  
  

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
    const username = params.get('username');

    if (username && !username.includes('.')) {
      console.log('Profile username from route:', username);
      
        console.log('Running in browser');
        this.loadUserProfile(username);
      this.loadFollowers(username);
      this.toggleFollowUser(username)
      
    }
  });
  }

  loadUserProfile(username: string) {
    if (typeof localStorage === 'undefined') {
    console.log('localStorage not available');
    return;
  }
  
  const token = localStorage.getItem('jwt');
  console.log('Loading profile for:', token);

  if (!token) {
    console.error('No JWT token found');
    return;
  }
      this.http.get(`http://localhost:8080/api/users/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: (data) => {
          this.user = {
            id: (data as any).userInfo.id,
            username: (data as any).userInfo.username,
            avatar: (data as any).userInfo.image,
            bio: (data as any).userInfo.bio,
            isFollowing: (data as any).isFollowing,
            isme: (data as any).isMe,
            avatarUrl: (data as any).avatar
          }
          console.log('Loaded user profile:', this.user.avatar);
          this.loadUserPosts(username);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading profile:', error.error);
          if (error.error === 'User not found') {
            this.routenav.navigate(['/']);
          }else {
            this.routenav.navigate(['/login']);
          }
        }
      });
    
  }

  loadUserPosts(username: string) {
    if (this.userPosts.length > 0) return;
    const token = localStorage.getItem('jwt'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<Post[]>(`http://localhost:8080/api/post/profile/${username}`, { headers })
      .subscribe(
        (data) => {
          this.userPosts = data;
          this.cdr.detectChanges();
          
        },
        (error) => {
          console.error('Error fetching user posts', error);
        }
      );
   
    
  }

  loadFollowers(username: string) {  
    if (this.followers.length > 0) return;
    const token = localStorage.getItem('jwt');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    this.http.get<FollowUser[]>(`http://localhost:8080/api/follow/${username}/followers`, 
      { headers } ).subscribe({
      next: (data) => {
        this.followers = data;
          this.toggleFollowUser(username)
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading followers:', error);
      }
    });
  }

  

  setActiveTab(tab: 'posts' | 'followers' | 'following') {
    this.activeTab = tab;
  }

  toggleFollow(user: User) {
    const profil:  FollowUser = {
      id: user.id,
      username: user.username,
      firstName: '',
      lastName: '',
      avatar: user.avatar,
      bio: user.bio,
      isFollowing: user.isFollowing || false,
    }
    this.UnFollow(profil);
    user.isFollowing = !user.isFollowing;
    this.cdr.detectChanges();
    
  }
  
  toggleFollowUser(username: string) {
    if (this.followers.length > 0) return;
    const token = localStorage.getItem('jwt');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<FollowUser[]>(`http://localhost:8080/api/follow/${username}/following`,
      { headers }).subscribe({
        next: (data) => {
          this.following = data;
          console.log(this.following)
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading followers:', error);
        }
      });
    this.cdr.detectChanges();
  }


  editProfile() {}
  //   console.log('Edit profile');
  //   // Navigate to edit profile page
  // }
  UnFollow(FollowUser: FollowUser) {

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found');
      this.routenav.navigate(['/login']);
      return;
    }
    // Create headers with Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (!localStorage.getItem('jwt')) {
      this.routenav.navigate(['/login']);
      return;
    }
    if (!FollowUser.isFollowing) {
      this.http.post(`http://localhost:8080/api/follow/${FollowUser.username}`, {}, { headers })
        .subscribe({
          next: (a) => {
            FollowUser.isFollowing = true;
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error following user:', error)
        });
    } else {
      console.log(`Unfollowed ${FollowUser.username}`);

      // Send to backend
      this.http.delete(`http://localhost:8080/api/follow/${FollowUser.username}`, { headers })
        .subscribe({
          next: (a) => {
            FollowUser.isFollowing = false;
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error unfollowing user:', error)
        });
    }
    this.cdr.detectChanges();

  }
  GoToProfile(username: string) {
    this.routenav.navigate([`/profile/${username}`]);
    this.userPosts = [];
    this.followers = [];
    this.following = [];
    this.ngOnInit();
  }

  openReportModal() {
    if (!this.user || this.user.isme) {
      return;
    }
    this.reportReason = '';
    this.reportError = '';
    this.reportModalOpen = true;
  }

  closeReportModal() {
    this.reportModalOpen = false;
    this.reportReason = '';
    this.reportError = '';
  }

  submitReport() {
    if (!this.user) return;
    const reason = this.reportReason.trim();
    if (!reason) {
      this.reportError = 'Please provide a reason for reporting.';
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      this.routenav.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post('http://localhost:8080/api/profile-reports', {
      username: this.user.username,
      reason
    }, { headers }).subscribe({
      next: () => {
        this.reportModalOpen = false;
        this.reportReason = '';
        alert('Thank you. The profile has been reported.');
      },
      error: (error) => {
        console.error('Failed to report profile', error);
        this.reportError = error?.error || 'Unable to submit report right now.';
      }
    });
  }
}
