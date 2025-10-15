import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post, Posts } from '../shered/posts/posts';
import { NavBar } from '../shered/nav-bar/nav-bar';



export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
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
    // Replace with actual API call
    // const username = this.route.snapshot.paramMap.get('username');
    // this.http.get<User>(`http://localhost:8080/api/users/${username}`)
    //   .subscribe(data => this.user = data);

    // Mock data
    this.user = {
      id: 1,
      username: 'benso',
      firstName: 'Benso',
      lastName: 'Developer',
      avatar: 'assets/profile-avatar.jpg',
      bio: 'Full-stack developer 💻 | Java Spring Boot & Angular enthusiast 🚀 | Building cool stuff in Morocco 🇲🇦',
      followersCount: 1523,
      followingCount: 342,
      postsCount: 87,
      isFollowing: false
    };
  }

  loadUserPosts() {
    this.userPosts = [
      {
        id: 1,
        username: 'benso',
        userAvatar: 'assets/profile-avatar.jpg',
        timestamp: new Date('2025-10-12T14:30:00'),
        content: 'Just deployed my Spring Boot authentication system! 🔐',
        imageUrl: 'assets/post1.jpg',
        likes: 156,
        comments: [],
        isLiked: false
      },
      {
        id: 2,
        username: 'benso',
        userAvatar: 'assets/profile-avatar.jpg',
        timestamp: new Date('2025-10-11T10:15:00'),
        content: 'Learning Angular 20 is amazing! The new control flow syntax is so clean.',
        likes: 89,
        comments: [],
        isLiked: false
      },
      {
        id: 3,
        username: 'benso',
        userAvatar: 'assets/profile-avatar.jpg',
        timestamp: new Date('2025-10-10T16:45:00'),
        content: 'Working with PostgreSQL and Docker Compose today 🐳',
        videoUrl: 'assets/demo.mp4',
        likes: 234,
        comments: [],
        isLiked: false
      }
    ];
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
    this.user.followersCount += this.user.isFollowing ? 1 : -1;
    
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
