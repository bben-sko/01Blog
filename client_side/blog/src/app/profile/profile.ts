import { ChangeDetectorRef, Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, Posts, } from '../shered/posts/posts';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { Users, UsersList } from '../shered/add-user/users-list';



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
  imports: [NavBar, RouterModule,Posts],
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
          this.loadUserPosts();
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

  loadUserPosts() {
    if (this.userPosts.length > 0) return;
    const token = localStorage.getItem('jwt'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<Post[]>(`http://localhost:8080/api/post/profile`, { headers })
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

  setActiveTab(tab: 'posts' | 'followers' | 'following') {
    this.activeTab = tab;
    
    if (tab === 'followers') {
      this.loadFollowers();
    } else if (tab === 'following') {
      this.loadFollowing();
    }
  }

  toggleFollow() {
    
  }
  //   this.user.isFollowing = !this.user.isFollowing;
    
  //   // Send to backend
  //   // const endpoint = this.user.isFollowing ? 'follow' : 'unfollow';
  //   // this.http.post(`http://localhost:8080/api/users/${this.user.id}/${endpoint}`, {})
  //   //   .subscribe();
  // }

  toggleFollowUser(user: FollowUser) {}
  //   const token = localStorage.getItem('jwt');

  //   if (!token) {
  //     console.error('No JWT token found');
  //     this.route.navigate(['/login']);
  //     return;
  //   }
  //   console.log('Toggling follow for user:', user.user.username, 'Currently followed:', user.isfollow);
  //   // Create headers with Authorization
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   if (!localStorage.getItem('jwt')) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   if (!user.isfollow) {
  //     this.http.post(`http://localhost:8080/api/follow/${user.user.username}`, {}, { headers })
  //       .subscribe({
  //         next: (a) => {
  //           user.isfollow = true;
  //           console.log(a)
  //         },
  //         error: (error) => console.error('Error following user:', error)
  //       });
  //   } else {
  //     console.log(`Unfollowed ${user.user.username}`);

  //     // Send to backend
  //     this.http.delete(`http://localhost:8080/api/follow/${user.user.username}`, { headers })
  //       .subscribe({
  //         next: (a) => {
  //           user.isfollow = false;
  //           console.log(a)
  //         },
  //         error: (error) => console.error('Error unfollowing user:', error)
  //       });
  //   }
  //   this.cdr.detectChanges();
  // }
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
