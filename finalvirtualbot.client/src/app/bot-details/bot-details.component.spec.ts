import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BotDetailsComponent } from './bot-details.component';
import { BotConfigService } from '../config-services/bot-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

// Mocked ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: () => 'mock-id' // Return a mock ID
    }
  }
};

// Mocked Router
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

// Mocked BotConfigService
const mockBotConfigService = {
  getBotConfigById: jasmine.createSpy('getBotConfigById').and.returnValue(of({
    botName: 'Test Bot',
    provider: 'aws-lex-v1',
    configVersion: '1.0.0',
    jsonServiceAccount: 'test-account',
    region: 'us-west-2',
    language: 'en'
  })),
  updateBotConfig: jasmine.createSpy('updateBotConfig').and.returnValue(of({}))
};

describe('BotDetailsComponent', () => {
  let component: BotDetailsComponent;
  let fixture: ComponentFixture<BotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BotDetailsComponent, // Importing standalone component
        HttpClientTestingModule // For mocking HTTP requests
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: BotConfigService, useValue: mockBotConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the BotDetailsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load bot configuration on init', () => {
    component.ngOnInit();
    expect(mockBotConfigService.getBotConfigById).toHaveBeenCalledWith('mock-id');
    expect(component.botConfig.botName).toBe('Test Bot');
    expect(component.botConfig.provider).toBe('aws-lex-v1');
    expect(component.botConfig.configVersion).toBe('1.0.0');
    expect(component.botConfig.jsonServiceAccount).toBe('test-account');
    expect(component.botConfig.region).toBe('us-west-2');
    expect(component.botConfig.language).toBe('en');
  });

  it('should display an error if loadBotConfig fails', () => {
    mockBotConfigService.getBotConfigById.and.returnValue(throwError(() => new Error('Load failed')));

    spyOn(window, 'alert');
    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Failed to load bot configuration.');
  });

  it('should update bot configuration and navigate to config page on save', () => {
    component.saveConfig();
    expect(mockBotConfigService.updateBotConfig).toHaveBeenCalledWith('mock-id', component.botConfig);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/config-component']);
  });

  it('should handle error while updating bot configuration', () => {
    const mockError = new Error('Update failed');
    mockBotConfigService.updateBotConfig.and.returnValue(throwError(() => mockError));

    spyOn(window, 'alert');
    component.saveConfig();
    expect(window.alert).toHaveBeenCalledWith('Failed to update the configuration.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to chat component on clicking "Chat with Bot" button', () => {
    component.navigateToChat();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/chat-component']);
  });

  it('should navigate back to config page on clicking "Back" button', () => {
    component.Back();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/config-component']);
  });
});
