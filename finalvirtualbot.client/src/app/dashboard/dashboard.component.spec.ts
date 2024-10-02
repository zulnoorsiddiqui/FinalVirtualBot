import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule, 
        DashboardComponent,  
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //T1: Creation
  it('should create the DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  //T2: Render elemenent sucessfullly
  it('should render the title "Welcome to Application Dashboard"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2')?.textContent;
    expect(title).toContain('Welcome to Application Dashboard');
  });

  //T3: Routing outlet
  it('should have a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull(); 
  });

  //T4: Chat Button should route correctly
  it('should have a "Chat" button with the correct routerLink', () => {
    const button = fixture.debugElement.query(By.css('button[routerLink="/chat-component"]'));
    expect(button).not.toBeNull();
    expect(button.attributes['routerLink']).toBe('/chat-component');
  });

  // T5: AddBot BUTTON to route correctly
  it('should have an "AddBOT" button with the correct routerLink', () => {
    const button = fixture.debugElement.query(By.css('button[routerLink="/config-component"]'));
    expect(button).not.toBeNull();
    expect(button.attributes['routerLink']).toBe('/config-component');
  });

  // T6: Should apply active class to active buttons
  it('should add the "active" class to the active routerLink', () => {
    const activeLinks = fixture.debugElement.queryAll(By.css('button.active'));
    expect(activeLinks.length).toBe(0);
  });

  // T7: Should navigate to ChatComponent when chat button is clicked
  it('should navigate to ChatComponent when "Chat" button is clicked', async () => {
    const chatButton = fixture.debugElement.query(By.css('button[routerLink="/chat-component"]'));
    chatButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const routerLink = chatButton.injector.get(RouterLinkWithHref);
    expect(routerLink['commands']).toEqual(['/chat-component']);
  });

  // T8: Should navigate to ConfigComponent when AddBOT button is clicked
  it('should navigate to ConfigComponent when "AddBOT" button is clicked', async () => {
    const configButton = fixture.debugElement.query(By.css('button[routerLink="/config-component"]'));
    configButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const routerLink = configButton.injector.get(RouterLinkWithHref);
    expect(routerLink['commands']).toEqual(['/config-component']);
  });
});
