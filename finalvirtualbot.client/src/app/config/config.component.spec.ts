import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigComponent } from './config.component';
import { BotConfigService } from '../config-services/bot-config.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BotConfig {
  id: string;
  botName: string;
  provider: string;
  configVersion: string;
  jsonServiceAccount: string;
  region: string;
  language: string;
}

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let botConfigService: jasmine.SpyObj<BotConfigService>;

  beforeEach(async () => {
    // Create a spy for BotConfigService
    botConfigService = jasmine.createSpyObj('BotConfigService', [
      'getAllBotConfigs',
      'createBotConfig',
      'deleteBotConfig'
    ]);

    await TestBed.configureTestingModule({
      imports: [ConfigComponent, CommonModule, FormsModule], // Import the standalone component here
      providers: [{ provide: BotConfigService, useValue: botConfigService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load bot configurations on init', () => {
    const mockConfigs: BotConfig[] = [
      {
        id: '1',
        botName: 'TestBot1',
        provider: 'TestProvider1',
        configVersion: '1.0',
        jsonServiceAccount: 'serviceAccount1',
        region: 'us-west',
        language: 'en'
      },
      {
        id: '2',
        botName: 'TestBot2',
        provider: 'TestProvider2',
        configVersion: '1.1',
        jsonServiceAccount: 'serviceAccount2',
        region: 'us-east',
        language: 'fr'
      }
    ];

    // Mock the getAllBotConfigs method
    botConfigService.getAllBotConfigs.and.returnValue(of(mockConfigs));

    // Call ngOnInit to load configs
    component.ngOnInit();

    expect(component.historyList.length).toBe(2);
    expect(component.historyList).toEqual(mockConfigs.map(({ id, botName, provider }) => ({ id, botName, provider })));
  });

  it('should save new bot configuration', () => {
    const newConfig: BotConfig = {
      id: '3', // Provide a unique ID for the new config
      botName: 'TestBot',
      provider: 'TestProvider',
      configVersion: '1.0',
      jsonServiceAccount: 'serviceAccount',
      region: 'us-central',
      language: 'en'
    };

    botConfigService.createBotConfig.and.returnValue(of(newConfig));

    // Set the component properties to simulate form input
    component.appName = newConfig.botName;
    component.botProvider = newConfig.provider;
    component.configVersion = newConfig.configVersion;
    component.JsonServiceAccount = newConfig.jsonServiceAccount;
    component.Region = newConfig.region;
    component.Language = newConfig.language;

    component.saveConfig();

    expect(botConfigService.createBotConfig).toHaveBeenCalledWith(newConfig);
  });

  it('should delete config successfully', () => {
    const configId = '1';
    botConfigService.deleteBotConfig.and.returnValue(of(undefined)); // Return an Observable<void>

    // Set up initial state
    component.historyList = [{ id: configId, botName: 'TestBot', provider: 'TestProvider' }];
    component.deleteConfig(configId);

    expect(botConfigService.deleteBotConfig).toHaveBeenCalledWith(configId);
    expect(component.historyList.length).toBe(0); // Ensure the item was removed from the history list
  });

  // Additional tests can be added here...
});
