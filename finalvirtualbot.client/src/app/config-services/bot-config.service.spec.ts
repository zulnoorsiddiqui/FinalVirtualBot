import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BotConfigService } from './bot-config.service';

// Define the BotConfig interface to match the service expectations
interface BotConfig {
  id?: string;
  botName: string;
  provider: string;
  configVersion: string;
  jsonServiceAccount: string;
  region: string;
  language: string;
}

describe('BotConfigService', () => {
  let service: BotConfigService;
  let httpTestingController: HttpTestingController;

  // Adjusted API URL to match your service
  const apiUrl = 'http://localhost:8080/api/BotConfig';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BotConfigService],
    });

    service = TestBed.inject(BotConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all bot configurations', () => {
    const mockConfigs: BotConfig[] = [
      {
        id: '1',
        botName: 'Bot1',
        provider: 'aws-lex-v1',
        configVersion: '1',
        jsonServiceAccount: '{}',
        region: 'us-east-1',
        language: 'en'
      },
      {
        id: '2',
        botName: 'Bot2',
        provider: 'google-dialogflow',
        configVersion: '2',
        jsonServiceAccount: '{}',
        region: 'us-west-2',
        language: 'es'
      }
    ];

    service.getAllBotConfigs().subscribe((configs) => {
      expect(configs).toEqual(mockConfigs);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockConfigs); // Simulate returning data
  });

  it('should fetch a bot configuration by ID', () => {
    const mockConfig: BotConfig = {
      id: '1',
      botName: 'Bot1',
      provider: 'aws-lex-v1',
      configVersion: '1',
      jsonServiceAccount: '{}',
      region: 'us-east-1',
      language: 'en'
    };

    service.getBotConfigById('1').subscribe((config) => {
      expect(config).toEqual(mockConfig);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig); // Simulate returning data
  });

  it('should create a new bot configuration', () => {
    const newConfig: BotConfig = {
      botName: 'Bot1',
      provider: 'aws-lex-v1',
      configVersion: '1',
      jsonServiceAccount: '{}',
      region: 'us-east-1',
      language: 'en'
    };
    const response = { id: '1', ...newConfig };

    service.createBotConfig(newConfig).subscribe((config) => {
      expect(config).toEqual(response);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(newConfig);
    req.flush(response); // Simulate returning data
  });

  it('should update an existing bot configuration', () => {
    const updatedConfig: BotConfig = {
      botName: 'Updated Bot',
      provider: 'aws-lex-v1',
      configVersion: '2',
      jsonServiceAccount: '{}',
      region: 'us-east-1',
      language: 'en'
    };
    const response = { id: '1', ...updatedConfig };

    service.updateBotConfig('1', updatedConfig).subscribe((config) => {
      expect(config).toEqual(response);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(updatedConfig);
    req.flush(response);
  });

  it('should delete a bot configuration by ID', () => {
    service.deleteBotConfig('1').subscribe((response) => {
      expect(response).toBeUndefined(); // Expect no content on successful delete
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simulate returning empty response
  });
});
