import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private scriptElement: HTMLScriptElement | undefined;

  ngOnInit(): void {
    // Check if running in the browser to avoid SSR issues
    if (typeof document !== 'undefined') {
      // Create a new script element
      this.scriptElement = document.createElement('script');
      this.scriptElement.type = 'text/javascript';
      this.scriptElement.async = true;

      // Define the content of the script
      this.scriptElement.innerHTML = `
        (function(n,u){
          window.BrandEmbassy=n,
          window[n]=window[n]||function(){(window[n].q=window[n].q||[]).push(arguments)},window[n].u=u,
          e=document.createElement("script"),e.async=1,e.src=u+"?"+Math.round(Date.now()/1e3/3600),
          document.head.appendChild(e)
        })('brandembassy','https://livechat-static-de-na1.niceincontact.com/4/chat.js');

        brandembassy('init', 1586, 'chat_07cbde97-7974-4986-9718-e0cce4e52cc7');
      `;

      // Append the script to the document body
      document.body.appendChild(this.scriptElement);
    }
  }

  ngOnDestroy(): void {
    // Check if running in the browser to avoid SSR issues
    if (typeof document !== 'undefined') {
      // Remove the script when the component is destroyed
      if (this.scriptElement) {
        document.body.removeChild(this.scriptElement);
      }
    }
  }
}
