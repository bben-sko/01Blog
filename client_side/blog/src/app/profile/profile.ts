import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, Posts } from '../shered/posts/posts';
import { NavBar } from '../shered/nav-bar/nav-bar';



export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface FollowUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavBar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user!: User;
  activeTab: 'posts' | 'followers' | 'following' = 'posts';
  
  userPosts: Post[] = [];
  followers: FollowUser[] = [];
  following: FollowUser[] = [];
  
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
  

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserPosts();
  }

  loadUserProfile() {
    this.loading = true;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });    
    // const username = this.route.snapshot.paramMap.get('username') || "amazighi";
    const username = "amazighi";
    console.log(username);
    this.http.get<User>(`http://localhost:8080/api/users/${username}`, { headers })
      .subscribe(
        (data) => {
          console.log(data);
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
  }

  loadUserPosts() {
    // if (this.userPosts.length > 0) return;
    // const username = this.route.snapshot.paramMap.get('username');
    // const token = localStorage.getItem('token'); 

    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    // this.http.get<Post[]>(`http://localhost:8080/api/post/user/${username}`, { headers })
    //   .subscribe(
    //     (data) => {
    //       console.log(data);
    //       this.userPosts = data;
    //     },
    //     (error) => {
    //       console.error('Error fetching user posts', error);
    //     }
    //   );
    
  }

  loadFollowers() {
    if (this.followers.length > 0) return;
    
    this.followers = [
      {
        id: 2,
        username: 'sarah_dev',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: 'assets/user1.jpg',
        bio: 'Full-stack developer',
        isFollowing: true
      },
      {
        id: 3,
        username: 'mike_codes',
        firstName: 'Mike',
        lastName: 'Chen',
        avatar: 'assets/user2.jpg',
        bio: 'Angular developer',
        isFollowing: false
      },
      {
        id: 4,
        username: 'emma_tech',
        firstName: 'Emma',
        lastName: 'Williams',
        avatar: 'assets/user3.jpg',
        bio: 'UI/UX Designer',
        isFollowing: true
      }
    ];
  }

  loadFollowing() {
    if (this.following.length > 0) return;
    
    this.following = [
      {
        id: 5,
        username: 'alex_dev',
        firstName: 'Alex',
        lastName: 'Martinez',
        avatar: 'assets/user4.jpg',
        bio: 'Software Engineer',
        isFollowing: true
      },
      {
        id: 6,
        username: 'lisa_codes',
        firstName: 'Lisa',
        lastName: 'Anderson',
        avatar: 'assets/user5.jpg',
        bio: 'JavaScript enthusiast',
        isFollowing: true
      }
    ];
  }

  setActiveTab(tab: 'posts' | 'followers' | 'following') {
    this.activeTab = tab;
    
    if (tab === 'followers') {
      this.loadFollowers();
    } else if (tab === 'following') {
      this.loadFollowing();
    }
  }

  toggleFollow() {
    this.user.isFollowing = !this.user.isFollowing;
    
    // Send to backend
    // const endpoint = this.user.isFollowing ? 'follow' : 'unfollow';
    // this.http.post(`http://localhost:8080/api/users/${this.user.id}/${endpoint}`, {})
    //   .subscribe();
  }

  toggleFollowUser(user: FollowUser) {
    user.isFollowing = !user.isFollowing;
    
    // Send to backend
    // const endpoint = user.isFollowing ? 'follow' : 'unfollow';
    // this.http.post(`http://localhost:8080/api/users/${user.id}/${endpoint}`, {})
    //   .subscribe();
  }

  editProfile() {
    console.log('Edit profile');
    // Navigate to edit profile page
  }
}
