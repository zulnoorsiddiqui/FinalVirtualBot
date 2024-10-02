import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, RegisterRequest, LoginRequest } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    const request: RegisterRequest = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const response = { success: true, message: 'User registered successfully' };

    service.register(request).subscribe(res => {
      expect(res.success).toBe(true);
      expect(res.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('https://localhost:7136/api/v1/authenticate/register');
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should log in a user', () => {
    const request: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = { success: true, accessToken: 'token123', message: 'Login successful' };

    service.login(request).subscribe(res => {
      expect(res.success).toBe(true);
      expect(res.accessToken).toBe('token123');
    });

    const req = httpMock.expectOne('https://localhost:7136/api/v1/authenticate/login');
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });
});
