
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivationStart, RouterModule } from '@angular/router';

interface loginResponse{
  token: string;
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
  error = "";

  d() {
    this.submitted = true;
    
    this.http.post("http://localhost:8080/api/auth/register", this.registerData)
      .subscribe({
        next: (response) => {
          console.log("register successful");
        },
        error: (error) => {
          console.error("Login failed:", error);
          this.error = error.err || "Login failed";
        }
      });
  }
}