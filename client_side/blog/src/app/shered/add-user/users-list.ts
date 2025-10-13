import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavBar } from '../nav-bar/nav-bar';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
  followers: number;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule,NavBar],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    
    // Replace with your actual API endpoint
    // this.http.get<User[]>('http://localhost:8080/api/users/suggestions')
    //   .subscribe({
    //     next: (data) => {
    //       this.users = data;
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       console.error('Error loading users:', error);
    //       this.loading = false;
    //       this.loadMockUsers();
    //     }
    //   });

    // Mock data for now
    this.loadMockUsers();
  }

  loadMockUsers() {
    this.users = [
      {
        id: 1,
        username: 'sarah_dev',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: 'assets/user1.jpg',
        bio: 'Full-stack developer | Coffee enthusiast ☕',
        isFollowing: false,
        followers: 1234
      },
      {
        id: 2,
        username: 'mike_codes',
        firstName: 'Mike',
        lastName: 'Chen',
        avatar: 'assets/user2.jpg',
        bio: 'Angular & Spring Boot developer 🚀',
        isFollowing: false,
        followers: 856
      },
      {
        id: 3,
        username: 'emma_tech',
        firstName: 'Emma',
        lastName: 'Williams',
        avatar: 'assets/user3.jpg',
        bio: 'Tech blogger | UI/UX Designer',
        isFollowing: false,
        followers: 2341
      },
      {
        id: 4,
        username: 'alex_dev',
        firstName: 'Alex',
        lastName: 'Martinez',
        avatar: 'assets/user4.jpg',
        bio: 'Software Engineer at TechCorp',
        isFollowing: false,
        followers: 567
      },
      {
        id: 5,
        username: 'lisa_codes',
        firstName: 'Lisa',
        lastName: 'Anderson',
        avatar: 'assets/user5.jpg',
        bio: 'JavaScript enthusiast | React & Angular',
        isFollowing: false,
        followers: 1890
      },
      {
        id: 6,
        username: 'david_tech',
        firstName: 'David',
        lastName: 'Brown',
        avatar: 'assets/user6.jpg',
        bio: 'Backend specialist | Java & Spring',
        isFollowing: false,
        followers: 445
      },
      {
        id: 7,
        username: 'jennifer_dev',
        firstName: 'Jennifer',
        lastName: 'Taylor',
        avatar: 'assets/user7.jpg',
        bio: 'Cloud architect | DevOps',
        isFollowing: false,
        followers: 3201
      },
      {
        id: 8,
        username: 'chris_codes',
        firstName: 'Chris',
        lastName: 'Wilson',
        avatar: 'assets/user8.jpg',
        bio: 'Mobile & Web developer',
        isFollowing: false,
        followers: 678
      }
    ];
    this.loading = false;
  }

  toggleFollow(user: User) {
    user.isFollowing = !user.isFollowing;
    
    if (user.isFollowing) {
      user.followers++;
      console.log(`Following ${user.username}`);
      
      // Send to backend
      // this.http.post(`http://localhost:8080/api/users/${user.id}/follow`, {})
      //   .subscribe({
      //     next: () => console.log('Followed successfully'),
      //     error: (error) => console.error('Error following user:', error)
      //   });
    } else {
      user.followers--;
      console.log(`Unfollowed ${user.username}`);
      
      // Send to backend
      // this.http.delete(`http://localhost:8080/api/users/${user.id}/follow`)
      //   .subscribe({
      //     next: () => console.log('Unfollowed successfully'),
      //     error: (error) => console.error('Error unfollowing user:', error)
      //   });
    }
  }

  viewProfile(user: User) {
    console.log('View profile:', user.username);
    // Navigate to user profile
    // this.router.navigate(['/profile', user.username]);
  }
}
