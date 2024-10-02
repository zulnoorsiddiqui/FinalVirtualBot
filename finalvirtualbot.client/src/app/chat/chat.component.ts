import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../web-socket.services/web-socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  public messages: { text: string; sender: string }[] = [];
  public newMessage: string = '';

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  ngOnInit(): void {
    // Establish WebSocket connection
    this.webSocketService.connect().then(() => {
      console.log('WebSocket connection established');
      
      // Receiving WebSocket messages
      this.webSocketService.getMessages().subscribe((response: string) => {
        try {
          const parsedResponse = JSON.parse(response);
          const fulfillmentTexts = parsedResponse.FulfillmentTexts;

          if (fulfillmentTexts && Array.isArray(fulfillmentTexts)) {
            fulfillmentTexts.forEach((text: string) => {
              this.messages.push({ text, sender: 'bot' });
            });
          } else {
            console.warn('FulfillmentTexts not found or not in array format');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
    }).catch((error) => {
      console.error('Failed to connect to WebSocket', error);
      this.router.navigate(['/login-register']); // Navigate to login on connection failure
    });
  }

  // Sending user's message
  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: 'user' });
      this.webSocketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  // End the chat session
  endChat(): void {
    this.webSocketService.disconnect().then(() => {
      console.log('WebSocket disconnected.');
      this.router.navigate(['/config-component']);
    }).catch((error) => {
      console.error('Failed to disconnect WebSocket', error);
    });
  }

  // Ensure WebSocket disconnects when component is destroyed
  ngOnDestroy(): void {
    this.webSocketService.disconnect().then(() => {
      console.log('WebSocket disconnected on component destroy');
    }).catch((error) => {
      console.error('Failed to disconnect WebSocket', error);
    });
  }
}
