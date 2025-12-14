import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBar } from './shered/nav-bar/nav-bar';
import { FeedbackToast } from './shered/feedback/feedback-toast';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
// import { Nav } from "module";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, CommonModule, FeedbackToast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoginPage = false;

  constructor(private router: Router)
   {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide navbar on login and register pages
        this.isLoginPage = event.url === '/login' || event.url === '/register';
      });
  }
}
