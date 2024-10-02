
import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './web-socket.service';
import { Subject } from 'rxjs';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWebSocket: WebSocket;
  let messageSubject: Subject<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });
    service = TestBed.inject(WebSocketService);
    messageSubject = new Subject<string>();

    // Mock the WebSocket class
    mockWebSocket = {
      send: jasmine.createSpy('send'),
      close: jasmine.createSpy('close'),
      readyState: WebSocket.OPEN,
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null
    } as unknown as WebSocket;

    // Spy on the WebSocket constructor
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connect()', () => {
    it('should establish a WebSocket connection', (done) => {
      service.connect().then(() => {
        expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:7136/ws');
        expect(mockWebSocket.onopen).toBeDefined();
        done();
      });

    
      mockWebSocket.onopen!(new Event('open'));
    });

    it('should reject connection if an error occurs', (done) => {
      service.connect().catch((error) => {
        expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:7136/ws');
        expect(mockWebSocket.onerror).toBeDefined();
        expect(error).toBeTruthy();
        done();
      });

      // Simulate the WebSocket error event
      mockWebSocket.onerror!(new Event('error'));
    });
  });

  describe('sendMessage()', () => {
    it('should send a message if WebSocket is open', () => {
      service.connect();
      
      // Mock the readyState to be WebSocket.OPEN using Object.defineProperty
      Object.defineProperty(mockWebSocket, 'readyState', { value: WebSocket.OPEN });
  
      service.sendMessage('Hello World');
      expect(mockWebSocket.send).toHaveBeenCalledWith('Hello World');
    });
  
    it('should not send a message if WebSocket is not open', () => {
      service.connect();
      
      // Mock the readyState to be WebSocket.CLOSED
      Object.defineProperty(mockWebSocket, 'readyState', { value: WebSocket.CLOSED });
  
      service.sendMessage('Hello World');
      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });
  });
  

  describe('getMessages()', () => {
    it('should receive messages and push them into the message subject', (done) => {
      service.connect().then(() => {
        const mockMessageEvent = { data: 'Test message' } as MessageEvent;
        
        service.getMessages().subscribe((message) => {
          expect(message).toBe('Test message');
          done();
        });

        // Simulate receiving a WebSocket message
        mockWebSocket.onmessage!(mockMessageEvent);
      });

      // Simulate WebSocket open
      mockWebSocket.onopen!(new Event('open'));
    });
  });

  describe('disconnect()', () => {
    it('should close the WebSocket connection', (done) => {
      service.connect().then(() => {
        service.disconnect().then(() => {
          expect(mockWebSocket.close).toHaveBeenCalled();
          done();
        });

        // Simulate WebSocket close
        mockWebSocket.onclose!(new CloseEvent('close'));
      });

      // Simulate WebSocket open
      mockWebSocket.onopen!(new Event('open'));
    });

    it('should resolve immediately if WebSocket is not connected', (done) => {
      service.disconnect().then(() => {
        expect(mockWebSocket.close).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('WebSocket close and error handling', () => {
    it('should handle WebSocket onclose event', (done) => {
      service.connect().then(() => {
        const closeEvent = new CloseEvent('close');

        // Attach a spy to the console log for verification
        spyOn(console, 'log');

        mockWebSocket.onclose!(closeEvent);
        expect(console.log).toHaveBeenCalledWith('WebSocket connection closed', closeEvent);
        done();
      });

      // Simulate WebSocket open
      mockWebSocket.onopen!(new Event('open'));
    });

    it('should handle WebSocket onerror event', (done) => {
      service.connect().catch((error) => {
        const errorEvent = new Event('error');

        // Attach a spy to the console log for verification
        spyOn(console, 'error');

        mockWebSocket.onerror!(errorEvent);
        expect(console.error).toHaveBeenCalledWith('WebSocket error', errorEvent);
        done();
      });

      // Simulate WebSocket error
      mockWebSocket.onerror!(new Event('error'));
    });
  });
});
