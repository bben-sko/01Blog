import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  username = "";
  
  XX()  {
    this.username = "test"
  }
  ngOnInit() {
    this.XX();
  }
}
