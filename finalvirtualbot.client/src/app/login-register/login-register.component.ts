import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest, LoginRequest, RegisterResponse, LoginResponse } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  
  resetForms() {
    this.registerObj = { 
      email: '', 
      name: '', 
      password: '', 
      confirmPassword: '' 
    };
    this.loginObj = { email: '', password: '' };
  }
  activeForm: 'login' | 'register' = 'login';

  registerObj: RegisterRequest = { 
    email: '', 
    name: '', 
     
    password: '', 
    confirmPassword: '' 
  };
  
  loginObj: LoginRequest = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {}

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
    this.resetForms(); // Clear fields when toggling
  }



  registerForm() {
    
    if (this.registerObj.password.length < 6) {
      this._snackbar.open('Password must be at least 6 characters long!', 'Close');
      return;
    }
  
  
    if (!/[A-Z]/.test(this.registerObj.password)) {
      this._snackbar.open('Password must contain at least one uppercase letter!', 'Close');
      return;
    }
  
   
    if (!/[!@#$%^&*]/.test(this.registerObj.password)) {
      this._snackbar.open('Password must contain at least one special character!', 'Close');
      return;
    }
  

    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      this._snackbar.open('Passwords do not match!', 'Close');
      return;
    }
  
 
    this.authService.register(this.registerObj).subscribe({
      next: (response: RegisterResponse) => {
        if (response.success) {
          this._snackbar.open('User registered successfully', 'Close');
          this.resetForms(); 
          this.toggleForm('login');
        } else {
         
          const message = response.message.toLowerCase();
          if (message.includes('email')) {
            this._snackbar.open('This email is already registered!', 'Close');
          } else if (message.includes('username')) {
            this._snackbar.open('This username is already taken!', 'Close');
          } else {
            this._snackbar.open(response.message || 'Registration failed!', 'Close');
          }
        }
      },
      error: () => this._snackbar.open('An error occurred during registration', 'Close')
    });
  }
  
  

  loginForm() {
    this.authService.login(this.loginObj).subscribe({
      next: (response: LoginResponse) => {
        if (response.success) {
          localStorage.setItem('authToken', response.accessToken || '');
          this._router.navigateByUrl('/dashboard');
          this._snackbar.open('Login successful', 'Close');
          console.log('Login successful! Token:', response.accessToken);
          this.resetForms(); // Clear fields after successful login
        } else {
          this._snackbar.open(response.message || 'Login failed!', 'Close');
        }
      },
      error: () => this._snackbar.open('An error occurred during login', 'Close')
    });
  }

}
