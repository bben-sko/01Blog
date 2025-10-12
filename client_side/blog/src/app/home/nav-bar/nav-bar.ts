import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  
  constructor(private router: Router) {}
  
  navigateToNewPost() {
    this.router.navigate(['/newpost']);
  }
}
