import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { authcheck } from '../sevice/authcheck';

interface RegisterResponse {
  err?: string;
  message?: string;
  // add fields your backend returns
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{
  registerData = {
    username: '',
    email: '',
    password: '',
    name: '',
    bio: '',
    avatar: '' // optional preexisting link if you already uploaded elsewhere
  };
  submitted = false;
  error = '';
  file?: File;

  private http = inject(HttpClient);
  private router = inject(Router);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0];
    if (!selected) return;
    this.file = selected; // capture the File from <input type="file"> [web:124][web:132]
  }
  ngOnInit(): void {
    new authcheck(this.http, this.router).checkAuth();
  }
  d() {
    this.submitted = true;
    this.error = '';

    // Validate required fields
    if (!this.registerData.username?.trim()) {
      this.error = 'Username is required';
      return;
    }
    if (!this.registerData.email?.trim()) {
      this.error = 'Email is required';
      return;
    }
    if (!this.registerData.password) {
      this.error = 'Password is required';
      return;
    }

    const form = new FormData();
    form.append('username', this.registerData.username.trim().toLowerCase());
    form.append('email', this.registerData.email.trim());
    form.append('password', this.registerData.password);
    form.append('name', this.registerData.name?.trim() || '');
    form.append('bio', this.registerData.bio?.trim() || '');

    if (this.file) {
      form.append('avatar', this.file);
    }

    this.http.post<RegisterResponse>('http://localhost:8080/api/auth/register', form)
      .subscribe({
        next: () => {
          console.log('register successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const server = err?.error;
          this.error = server?.err || server?.message || server?.detail || 'Registration failed';
          console.error('Registration failed:', err);
          this.submitted = false;
        }
      });
  }

}
