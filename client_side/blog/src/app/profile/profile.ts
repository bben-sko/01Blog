import { ChangeDetectorRef, Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, Posts } from '../shered/posts/posts';
import { NavBar } from '../shered/nav-bar/nav-bar';



export interface User {
  id: number ;
  username: string;
  avatar?: string;
  bio?: string;
  isme: boolean;
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
  imports: [NavBar, RouterModule],
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
            isme: (data as any).isMe,
          }
          this.cdr.detectChanges();
          console.log('Loaded profile:', this.user);
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

  loadUserPosts() {}
  //   // if (this.userPosts.length > 0) return;
  //   // const username = this.route.snapshot.paramMap.get('username');
  //   // const token = localStorage.getItem('token'); 

  //   // const headers = new HttpHeaders({
  //   //   'Authorization': `Bearer ${token}`
  //   // });
  //   // this.http.get<Post[]>(`http://localhost:8080/api/post/user/${username}`, { headers })
  //   //   .subscribe(
  //   //     (data) => {
  //   //       console.log(data);
  //   //       this.userPosts = data;
  //   //     },
  //   //     (error) => {
  //   //       console.error('Error fetching user posts', error);
  //   //     }
  //   //   );
    
  // }

  loadFollowers() {}
  //   if (this.followers.length > 0) return;
    
  //   this.followers = [
  //     {
  //       id: 2,
  //       username: 'sarah_dev',
  //       firstName: 'Sarah',
  //       lastName: 'Johnson',
  //       avatar: 'assets/user1.jpg',
  //       bio: 'Full-stack developer',
  //       isFollowing: true
  //     },
  //     {
  //       id: 3,
  //       username: 'mike_codes',
  //       firstName: 'Mike',
  //       lastName: 'Chen',
  //       avatar: 'assets/user2.jpg',
  //       bio: 'Angular developer',
  //       isFollowing: false
  //     },
  //     {
  //       id: 4,
  //       username: 'emma_tech',
  //       firstName: 'Emma',
  //       lastName: 'Williams',
  //       avatar: 'assets/user3.jpg',
  //       bio: 'UI/UX Designer',
  //       isFollowing: true
  //     }
  //   ];
  // }

  loadFollowing() {}
  //   if (this.following.length > 0) return;
    
  //   this.following = [
  //     {
  //       id: 5,
  //       username: 'alex_dev',
  //       firstName: 'Alex',
  //       lastName: 'Martinez',
  //       avatar: 'assets/user4.jpg',
  //       bio: 'Software Engineer',
  //       isFollowing: true
  //     },
  //     {
  //       id: 6,
  //       username: 'lisa_codes',
  //       firstName: 'Lisa',
  //       lastName: 'Anderson',
  //       avatar: 'assets/user5.jpg',
  //       bio: 'JavaScript enthusiast',
  //       isFollowing: true
  //     }
  //   ];
  // }

  setActiveTab(tab: 'posts' | 'followers' | 'following') {}
  //   this.activeTab = tab;
    
  //   if (tab === 'followers') {
  //     this.loadFollowers();
  //   } else if (tab === 'following') {
  //     this.loadFollowing();
  //   }
  // }

  toggleFollow() {}
  //   this.user.isFollowing = !this.user.isFollowing;
    
  //   // Send to backend
  //   // const endpoint = this.user.isFollowing ? 'follow' : 'unfollow';
  //   // this.http.post(`http://localhost:8080/api/users/${this.user.id}/${endpoint}`, {})
  //   //   .subscribe();
  // }

  toggleFollowUser(user: FollowUser) {}
  //   user.isFollowing = !user.isFollowing;
    
  //   // Send to backend
  //   // const endpoint = user.isFollowing ? 'follow' : 'unfollow';
  //   // this.http.post(`http://localhost:8080/api/users/${user.id}/${endpoint}`, {})
  //   //   .subscribe();
  // }

  editProfile() {}
  //   console.log('Edit profile');
  //   // Navigate to edit profile page
  // }
}
