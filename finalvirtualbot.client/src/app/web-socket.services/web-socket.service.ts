import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<string>();
  private isConnected = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Method to establish a WebSocket connection
  public connect(): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        // WebSocket is not available, resolving silently
        resolve();
        return;
      }

      if (this.isConnected) {
        // Already connected, resolving silently
        resolve();
        return;
      }

      this.socket = new WebSocket('http://localhost:8080/ws'); // Use 'ws' instead of 'http'

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connection established');
        resolve();
      };

      this.socket.onerror = (event: Event) => {
        // Handle WebSocket error silently
        resolve();
      };

      this.socket.onclose = (event: CloseEvent) => {
        this.isConnected = false;
        console.log('WebSocket connection closed', event);
      };

      this.socket.onmessage = (event: MessageEvent) => {
        this.messagesSubject.next(event.data);
      };
    });
  }

  // Method to send a message through the WebSocket
  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
    // Suppressing warning if WebSocket is not open
  }

  // Observable to listen for messages from the WebSocket
  public getMessages(): Observable<string> {
    return this.messagesSubject.asObservable();
  }

  // Method to disconnect the WebSocket connection
  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.onclose = () => {
          this.isConnected = false;
          console.log('WebSocket connection closed.');
          resolve();
        };
        this.socket.close();
      } else {
        // Suppressing warning if already closed or not initialized
        resolve();
      }
    });
  }
}
