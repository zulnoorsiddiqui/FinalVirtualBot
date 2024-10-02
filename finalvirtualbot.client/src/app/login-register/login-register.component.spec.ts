import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginRegisterComponent } from './login-register.component';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginRegisterComponent', () => {
  let component: LoginRegisterComponent;
  let fixture: ComponentFixture<LoginRegisterComponent>;
  let authServiceMock: any;
  let snackBarMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mock AuthService
    authServiceMock = jasmine.createSpyObj('AuthService', ['register', 'login']);
    // Mock MatSnackBar
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    // Mock Router
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],  // Add necessary modules here
      declarations: [], 
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents();
    
    // Create the component
    fixture = TestBed.createComponent(LoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('registerForm', () => {
    it('should show an error if password is less than 6 characters', () => {
      component.registerObj.password = 'hello';
      component.registerObj.confirmPassword = 'hello';
      component.registerForm();
      expect(snackBarMock.open).toHaveBeenCalledWith('Password must be at least 6 characters long!', 'Close');
    });

    it('should show an error if passwords do not match', () => {
      component.registerObj.password = 'Password1!';
      component.registerObj.confirmPassword = 'Password2!';
      component.registerForm();
      expect(snackBarMock.open).toHaveBeenCalledWith('Passwords do not match!', 'Close');
    });

    it('should show an error if password does not contain an uppercase letter', () => {
      component.registerObj.password = 'password!';
      component.registerObj.confirmPassword = 'password!';
      component.registerForm();
      expect(snackBarMock.open).toHaveBeenCalledWith('Password must contain at least one uppercase letter!', 'Close');
    });

    it('should show an error if password does not contain a special character', () => {
      component.registerObj.password = 'Password';
      component.registerObj.confirmPassword = 'Password';
      component.registerForm();
      expect(snackBarMock.open).toHaveBeenCalledWith('Password must contain at least one special character!', 'Close');
    });

    it('should call register on AuthService if validation passes', () => {
      const mockResponse = { success: true };
      authServiceMock.register.and.returnValue(of(mockResponse));

      component.registerObj.password = 'Password1!';
      component.registerObj.confirmPassword = 'Password1!';
      component.registerForm();

      expect(authServiceMock.register).toHaveBeenCalled();
    });

    it('should show success message and reset forms if registration is successful', () => {
      const mockResponse = { success: true };
      authServiceMock.register.and.returnValue(of(mockResponse));

      component.registerObj.password = 'Password1!';
      component.registerObj.confirmPassword = 'Password1!';
      component.registerForm();

      expect(snackBarMock.open).toHaveBeenCalledWith('User registered successfully', 'Close');
      expect(component.registerObj.email).toBe(''); // Ensure the form is reset
    });

    it('should show an error message if registration fails', () => {
      const mockResponse = { success: false, message: 'This email is already registered!' };
      authServiceMock.register.and.returnValue(of(mockResponse));

      component.registerObj.password = 'Password1!';
      component.registerObj.confirmPassword = 'Password1!';
      component.registerForm();

      expect(snackBarMock.open).toHaveBeenCalledWith('This email is already registered!', 'Close');
    });
  });

  describe('loginForm', () => {
    it('should call login on AuthService when login is submitted', () => {
      const mockResponse = { success: true, accessToken: 'abc123' };
      authServiceMock.login.and.returnValue(of(mockResponse));

      component.loginObj.email = 'test@example.com';
      component.loginObj.password = 'password123';
      component.loginForm();

      expect(authServiceMock.login).toHaveBeenCalledWith(component.loginObj);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
      expect(snackBarMock.open).toHaveBeenCalledWith('Login successful', 'Close');
    });

    it('should show an error message if login fails', () => {
      const mockResponse = { success: false, message: 'Login failed!' };
      authServiceMock.login.and.returnValue(of(mockResponse));

      component.loginObj.email = 'test@example.com';
      component.loginObj.password = 'password123';
      component.loginForm();

      expect(snackBarMock.open).toHaveBeenCalledWith('Login failed!', 'Close');
    });
  });
});
