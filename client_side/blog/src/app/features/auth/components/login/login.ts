import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

async onSubmit(): Promise<void> {
  
  if (event) event.preventDefault();
  this.submitted = true;
  this.errorMessage = '';

  if (this.loginForm.invalid) {
    return;
  }

    // Stop if form is invalid
   
    this.loading = true;

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    console.log('Login data:', loginData);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        
        // Save token to localStorage
        localStorage.setItem('token', data.token);
     
      } else {
        const errorData = await response.json();
        this.errorMessage = errorData.message || 'Login failed';
        console.log('Login failed:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Network error. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  
}
