import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { elementAt } from 'rxjs';
import { authcheck } from '../sevice/authcheck';

interface loginResponse{
  token: string;
  err : string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements  OnInit  {
  title = 'Login Page';
  dataLogin = { userEmail: "", password: "" };
  submitted = false;
  // private http = inject(HttpClient);
  error = "";
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    new authcheck(this.http, this.router).checkAuth('/login');
  }
  d() {
    this.submitted = true;
    this.error = "";
    
    this.http.post<loginResponse>("http://localhost:8080/api/auth/login", this.dataLogin)
      .subscribe({
        next: (response) => {
          console.log("Login successful:", response);
          localStorage.setItem("jwt", response.token )
          this.router.navigate(["/"])
        },
        error: (errorResponse) => {
          console.error("Login failed:", errorResponse);
          const backendError = errorResponse?.error;
          if (typeof backendError === 'string') {
            this.error = backendError;
          } else if (backendError?.err) {
            this.error = backendError.err;
          } else if (backendError?.message) {
            this.error = backendError.message;
          } else {
            this.error = "Login failed. Please check your credentials.";
          }
        }
      });
  }
}
