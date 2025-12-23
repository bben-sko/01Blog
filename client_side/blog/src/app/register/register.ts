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
    this.file = selected; 
  }
  ngOnInit(): void {
    new authcheck(this.http, this.router).checkAuth("/register");
  }
  register() {
  this.submitted = true;
  this.error = '';

  const username = this.registerData.username?.trim();
  const email = this.registerData.email?.trim();
  const password = this.registerData.password;

  // Regex rules
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Required fields
  if (!username) {
    this.error = 'Username is required';
    return;
  }

  if (!usernameRegex.test(username)) {
    this.error = 'Username must be 3–20 characters (letters, numbers, underscore)';
    return;
  }

  if (!email) {
    this.error = 'Email is required';
    return;
  }

  if (!emailRegex.test(email)) {
    this.error = 'Invalid email format';
    return;
  }

  if (!password) {
    this.error = 'Password is required';
    return;
  }

  if (password.length < 8) {
    this.error = 'Password must be at least 8 characters';
    return;
  }

  // Build form
  const form = new FormData();
  form.append('username', username.toLowerCase());
  form.append('email', email);
  form.append('password', password);
  form.append('name', this.registerData.name?.trim() || '');
  form.append('bio', this.registerData.bio?.trim() || '');

  if (this.file) {
    form.append('avatar', this.file);
  }

  // Submit
  this.http.post<RegisterResponse>('http://localhost:8080/api/auth/register', form)
    .subscribe({
      next: () => {
        console.log('Register successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const server = err?.error;
        this.error =
          server?.err ||
          server?.message ||
          server?.detail ||
          'Registration failed';
        this.submitted = false;
      }
    });
}


}
