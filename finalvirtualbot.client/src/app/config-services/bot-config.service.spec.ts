// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { BotConfigService } from './bot-config.service';

// describe('BotConfigService', () => {
//   let service: BotConfigService;
//   let httpTestingController: HttpTestingController;

//   const apiUrl = 'https://localhost:7136/api/BotConfig';

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [BotConfigService],
//     });

//     service = TestBed.inject(BotConfigService);
//     httpTestingController = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     // Verify that no unmatched requests are outstanding.
//     httpTestingController.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should fetch all bot configurations', () => {
//     const mockConfigs = [{ id: '1', botName: 'Bot1' }, { id: '2', botName: 'Bot2' }];

//     service.getAllBotConfigs().subscribe((configs) => {
//       expect(configs).toEqual(mockConfigs);
//     });

//     const req = httpTestingController.expectOne(apiUrl);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockConfigs); // Simulate returning data
//   });

//   it('should fetch a bot configuration by ID', () => {
//     const mockConfig = { id: '1', botName: 'Bot1' };

//     service.getBotConfigById('1').subscribe((config) => {
//       expect(config).toEqual(mockConfig);
//     });

//     const req = httpTestingController.expectOne(`${apiUrl}/1`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockConfig); // Simulate returning data
//   });

//   it('should create a new bot configuration', () => {
//     const newConfig = { botName: 'Bot1', provider: 'aws-lex-v1' };
//     const response = { id: '1', ...newConfig };

//     service.createBotConfig(newConfig).subscribe((config) => {
//       expect(config).toEqual(response);
//     });

//     const req = httpTestingController.expectOne(apiUrl);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.headers.get('Content-Type')).toBe('application/json');
//     expect(req.request.body).toEqual(newConfig);
//     req.flush(response); // Simulate returning data
//   });

//   it('should update an existing bot configuration', () => {
//     const updatedConfig = { botName: 'Updated Bot' };
//     const response = { id: '1', ...updatedConfig };

//     service.updateBotConfig('1', updatedConfig).subscribe((config) => {
//       expect(config).toEqual(response);
//     });

//     const req = httpTestingController.expectOne(`${apiUrl}/1`);
//     expect(req.request.method).toBe('PUT');
//     expect(req.request.headers.get('Content-Type')).toBe('application/json');
//     expect(req.request.body).toEqual(updatedConfig);
//     req.flush(response); 
//   });

//   it('should delete a bot configuration by ID', () => {
//     service.deleteBotConfig('1').subscribe((response) => {
//       expect(response).toBeTruthy();
//     });

//     const req = httpTestingController.expectOne(`${apiUrl}/1`);
//     expect(req.request.method).toBe('DELETE');
//     req.flush({}); 
//   });
// });
