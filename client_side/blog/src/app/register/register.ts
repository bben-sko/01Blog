
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivationStart, Router, RouterModule } from '@angular/router';

interface registerResponse{
  err : string
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerData = { 
    username: "",
    email: "",
    password: "",
    name: "",
    bio: "",
    avatar: "",    
  };
  submitted = false;
  private http = inject(HttpClient);
  private router = inject(Router);
  error = "";

  d() {
    this.submitted = true;
    
    this.http.post<registerResponse>("http://localhost:8080/api/auth/register", this.registerData)
      .subscribe({
        next: (response) => {
          console.log("register successful");
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error("Login failed:", error);
          this.error = error.err || "Login failed";
        }
      });
  }
}