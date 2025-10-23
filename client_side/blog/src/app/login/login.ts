import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
export class Login {
  title = 'Login Page';
  dataLogin = { userEmail: "", password: "" };
  submitted = false;
  // private http = inject(HttpClient);
  error = "";
  constructor(private router: Router, private http: HttpClient) {}
  d() {
    this.submitted = true;
    
    this.http.post<loginResponse>("http://localhost:8080/api/auth/login", this.dataLogin)
      .subscribe({
        next: (response) => {
          console.log("Login successful:", response);
          localStorage.setItem("jwt", response.token )
          this.router.navigate(["/"])
        },
        error: (error) => {
          console.error("Login failed:", error);
          this.error = error.err || "Login failed";
        }
      });
  }
}