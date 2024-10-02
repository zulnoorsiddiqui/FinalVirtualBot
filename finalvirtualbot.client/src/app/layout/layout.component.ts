import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'], // fixed styleUrls
})
export class LayoutComponent {
  loggedUser: any;

  constructor(private _router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Check if running in a browser
    if (isPlatformBrowser(this.platformId)) {
      const localUser = localStorage.getItem('loggedUser');
      if (localUser) {
        this.loggedUser = JSON.parse(localUser);
      }
    }
  }

  onLogOut() {
    // Check if running in a browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedUser');
    }
    this._router.navigateByUrl('/login-register');
  }
}
