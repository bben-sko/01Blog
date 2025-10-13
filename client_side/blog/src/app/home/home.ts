import { Component } from '@angular/core';
import { NavBar } from '../shered/nav-bar/nav-bar';
import { Post, Posts } from '../shered/posts/posts';


@Component({
  selector: 'app-home',
  imports: [NavBar, Posts],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
 posts: Post[] = [
    {
      id: 1,
      username: 'John Doe',
      userAvatar: 'assets/avatar1.jpg',
      timestamp: new Date('2025-10-12T10:30:00'),
      content: 'Just finished an amazing Angular project! 🚀',
      imageUrl: 'assets/post1.jpg',
      likes: 42,
      comments: [],
      isLiked: false
    },
    {
      id: 2,
      username: 'Jane Smith',
      userAvatar: 'assets/avatar2.jpg',
      timestamp: new Date('2025-10-12T09:15:00'),
      content: 'Beautiful sunset at the beach today 🌅',
      imageUrl: 'assets/post2.jpg',
      likes: 128,
      comments: [],
      isLiked: true
    },
    {
      id: 3,
      username: 'Mike Johnson',
      userAvatar: 'assets/avatar3.jpg',
      timestamp: new Date('2025-10-12T08:45:00'),
      content: 'Learning TypeScript is so much fun! Who else is coding today?',
      likes: 67,
      comments: [],
      isLiked: false
    },
    {
      id: 4,
      username: 'Sarah Williams',
      userAvatar: 'assets/avatar4.jpg',
      timestamp: new Date('2025-10-11T22:30:00'),
      content: 'Check out this amazing tutorial I found!',
      videoUrl: 'assets/video1.mp4',
      likes: 95,
      comments: [],
      isLiked: false
    },
    {
      id: 5,
      username: 'David Brown',
      userAvatar: 'assets/avatar5.jpg',
      timestamp: new Date('2025-10-11T20:15:00'),
      content: 'Coffee and code - the perfect combination ☕💻',
      imageUrl: 'assets/post3.jpg',
      likes: 203,
      comments: [],
      isLiked: true
    },
    {
      id: 6,
      username: 'Emily Davis',
      userAvatar: 'assets/avatar6.jpg',
      timestamp: new Date('2025-10-11T18:00:00'),
      content: 'Deployed my first Spring Boot application today! Feeling accomplished 🎉',
      likes: 156,
      comments: [],
      isLiked: false
    },
    {
      id: 7,
      username: 'Chris Wilson',
      userAvatar: 'assets/avatar7.jpg',
      timestamp: new Date('2025-10-11T15:30:00'),
      content: 'Morning run completed! Time to code 💪',
      imageUrl: 'assets/post4.jpg',
      videoUrl: 'assets/video2.mp4',
      likes: 89,
      comments: [],
      isLiked: false
    },
    {
      id: 8,
      username: 'Lisa Anderson',
      userAvatar: 'assets/avatar8.jpg',
      timestamp: new Date('2025-10-11T12:45:00'),
      content: 'Working on a new Angular 20 project. The new features are incredible!',
      likes: 112,
      comments: [],
      isLiked: true
    },
    {
      id: 9,
      username: 'Tom Martinez',
      userAvatar: 'assets/avatar9.jpg',
      timestamp: new Date('2025-10-11T10:20:00'),
      content: 'Just discovered this amazing JavaScript trick! Mind blown 🤯',
      imageUrl: 'assets/post5.jpg',
      likes: 234,
      comments: [],
      isLiked: false
    },
    {
      id: 10,
      username: 'Rachel Taylor',
      userAvatar: 'assets/avatar10.jpg',
      timestamp: new Date('2025-10-11T08:00:00'),
      content: 'Happy Sunday everyone! What are you building this weekend?',
      likes: 78,
      comments: [],
      isLiked: false
    }
  ];
}
