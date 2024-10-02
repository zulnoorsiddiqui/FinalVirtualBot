// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ConfigComponent } from './config.component';
// import { BotConfigService } from '../config-services/bot-config.service';
// import { of, throwError } from 'rxjs';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// describe('ConfigComponent', () => {
//   let component: ConfigComponent;
//   let fixture: ComponentFixture<ConfigComponent>;
//   let mockBotConfigService: jasmine.SpyObj<BotConfigService>;
//   let mockRouter: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     // Create spies for the BotConfigService and Router
//     mockBotConfigService = jasmine.createSpyObj('BotConfigService', [
//       'getAllBotConfigs',
//       'createBotConfig',
//       'deleteBotConfig'
//     ]);

//     mockRouter = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       imports: [ConfigComponent],  // Import the standalone component
//       providers: [
//         { provide: BotConfigService, useValue: mockBotConfigService },
//         { provide: Router, useValue: mockRouter }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]  // Ignore unknown elements in the template
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ConfigComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create the ConfigComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load bot configs on initialization', () => {
//     const mockConfigs = [
//       { id: '1', botName: 'Bot1', provider: 'aws-lex-v1' },
//       { id: '2', botName: 'Bot2', provider: 'cxone-smartassist' }
//     ];

//     mockBotConfigService.getAllBotConfigs.and.returnValue(of(mockConfigs));

//     component.ngOnInit();

//     expect(component.historyList).toEqual(mockConfigs);
//     expect(mockBotConfigService.getAllBotConfigs).toHaveBeenCalled();
//   });

//   it('should save a new bot configuration', () => {
//     component.appName = 'New Bot';
//     component.botProvider = 'aws-lex-v1';
//     component.configVersion = '1.0.0';
//     component.JsonServiceAccount = 'service-account.json';
//     component.Region = 'us-west-2';
//     component.Language = 'en';

//     mockBotConfigService.createBotConfig.and.returnValue(of({}));

//     component.saveConfig();

//     expect(mockBotConfigService.createBotConfig).toHaveBeenCalledWith(jasmine.objectContaining({
//       botName: 'New Bot',
//       provider: 'aws-lex-v1',
//       configVersion: '1.0.0',
//       jsonServiceAccount: 'service-account.json',
//       region: 'us-west-2',
//       language: 'en'
//     }));
//   });

//   it('should handle error when saving configuration', () => {
//     component.appName = 'New Bot';
//     component.botProvider = 'aws-lex-v1';
//     component.configVersion = '1.0.0';
//     component.JsonServiceAccount = 'service-account.json';
//     component.Region = 'us-west-2';
//     component.Language = 'en';

//     mockBotConfigService.createBotConfig.and.returnValue(throwError('Error'));

//     spyOn(window, 'alert'); // Spy on alert

//     component.saveConfig();

//     expect(window.alert).toHaveBeenCalledWith('Failed to save the configuration.');
//   });

//   it('should remove a bot configuration', () => {
//     const config = { id: '1', botName: 'Bot1', provider: 'aws-lex-v1' };
//   //  mockBotConfigService.deleteBotConfig.and.returnValue(of({}));

//     component.historyList = [config];

//     spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog

//     component.removeConfig(config);

//     expect(mockBotConfigService.deleteBotConfig).toHaveBeenCalledWith('1');
//     expect(component.historyList).toEqual([]); // Verify the config was removed
//   });

//   it('should handle error when removing configuration', () => {
//     const config = { id: '1', botName: 'Bot1', provider: 'aws-lex-v1' };
//     mockBotConfigService.deleteBotConfig.and.returnValue(throwError('Error'));

//     component.historyList = [config];

//     spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog
//     spyOn(window, 'alert'); // Spy on alert

//     component.removeConfig(config);

//     expect(window.alert).toHaveBeenCalledWith('Failed to delete the bot. Please try again.');
//   });

//   it('should check if the form is valid', () => {
//     component.appName = 'Bot';
//     component.botProvider = 'aws-lex-v1';
//     component.configVersion = '1.0.0';
//     component.JsonServiceAccount = 'service-account.json';
//     component.Region = 'us-west-2';
//     component.Language = 'en';

//     expect(component.isFormValid()).toBeTrue();

//     component.appName = ''; // Set to invalid case
//     expect(component.isFormValid()).toBeFalse();
//   });

//   it('should reset the form fields', () => {
//     component.botProvider = 'aws-lex-v1';
//     component.appName = 'Bot';
//     component.configVersion = '1.0.0';
//     component.JsonServiceAccount = 'service-account.json';
//     component.Region = 'us-west-2';
//     component.Language = 'en';

//     component.resetForm();

//     expect(component.botProvider).toBe('');
//     expect(component.appName).toBe('');
//     expect(component.configVersion).toBe('');
//     expect(component.JsonServiceAccount).toBe('');
//     expect(component.Region).toBe('');
//     expect(component.Language).toBe('');
//   });

//   it('should navigate to bot details', () => {
//     component.viewBotDetails('1');

//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/bot-details/1']);
//   });
// });
