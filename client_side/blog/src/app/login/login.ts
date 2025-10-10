import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface loginResponse{
  token: string;
  err : string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  dataLogin = { userEmail: "", password: "" };
  submitted = false;
  private http = inject(HttpClient);
  error = "";

  d() {
    this.submitted = true;
    
    this.http.post<loginResponse>("http://localhost:8080/api/auth/login", this.dataLogin)
      .subscribe({
        next: (response) => {
          console.log("Login successful:", response);
          localStorage.setItem("jwt", response.token )
        },
        error: (error) => {
          console.error("Login failed:", error);
          this.error = error.err || "Login failed";
        }
      });
  }
}
