import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { WebSocketService } from '../web-socket.services/web-socket.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockWebSocketService: jasmine.SpyObj<WebSocketService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockWebSocketService = jasmine.createSpyObj('WebSocketService', ['connect', 'disconnect', 'getMessages', 'sendMessage']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, ChatComponent],
      providers: [
        { provide: WebSocketService, useValue: mockWebSocketService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;

    // Mock WebSocketService's methods
    mockWebSocketService.connect.and.returnValue(Promise.resolve());
    mockWebSocketService.getMessages.and.returnValue(of(JSON.stringify({
      FulfillmentTexts: ['Test message from bot']
    })));
    mockWebSocketService.disconnect.and.returnValue(Promise.resolve());

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the ChatComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a session ID and store it in localStorage on init', () => {
    const sessionId = localStorage.getItem('chatSessionId');
    expect(sessionId).toContain('chat-session-');
  });

  it('should establish a WebSocket connection on init', async () => {
    await component.ngOnInit();
    expect(mockWebSocketService.connect).toHaveBeenCalled();
  });



  it('should send a message via WebSocket and add it to the messages array', () => {
    component.newMessage = 'Hello';
    component.sendMessage();
    
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].text).toBe('Hello'); // Updated to match the structure
    expect(component.messages[0].sender).toBe('user'); // Check sender
    expect(mockWebSocketService.sendMessage).toHaveBeenCalledWith('Hello');
    expect(component.newMessage).toBe(''); // Ensure message input is cleared
  });

  it('should not send a message if the input is empty or just whitespace', () => {
    component.newMessage = '   ';
    component.sendMessage();
    
    expect(component.messages.length).toBe(0);
    expect(mockWebSocketService.sendMessage).not.toHaveBeenCalled();
  });

  it('should end chat by clearing sessionId and navigating to config-component', () => {
    component.endChat();

    expect(localStorage.getItem('chatSessionId')).toBeNull(); 
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/config-component']); // Redirected to config page
  });

  it('should disconnect the WebSocket when component is destroyed', async () => {
    component.ngOnDestroy();
    expect(mockWebSocketService.disconnect).toHaveBeenCalled();
  });
});
