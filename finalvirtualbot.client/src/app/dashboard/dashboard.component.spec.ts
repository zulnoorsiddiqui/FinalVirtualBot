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

  //creation of component
  it('should create the DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  // render title
  it('should render the title "Welcome to Application Dashboard"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2')?.textContent;
    expect(title).toContain('Welcome to Application Dashboard');
  });

  // test for router outlet
  it('should have a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull();
  });

  // testing chat button
  it('should have a "Chat" button with the correct routerLink', () => {
    const button = fixture.debugElement.query(By.css('button[routerLink="/chat-component"]'));
    expect(button).not.toBeNull();
    expect(button.attributes['routerLink']).toBe('/chat-component');
  });

  //  test of addbot button
  it('should have an "AddBOT" button with the correct routerLink', () => {
    const button = fixture.debugElement.query(By.css('button[routerLink="/config-component"]'));
    expect(button).not.toBeNull();
    expect(button.attributes['routerLink']).toBe('/config-component');
  });

  // active button test
  it('should add the "active" class to the active routerLink', () => {
    const activeLinks = fixture.debugElement.queryAll(By.css('button.active'));
    expect(activeLinks.length).toBe(0);
  });

  // navigation of chat button
  it('should navigate to ChatComponent when "Chat" button is clicked', async () => {
    const chatButton = fixture.debugElement.query(By.css('button[routerLink="/chat-component"]'));
    chatButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const routerLink = chatButton.injector.get(RouterLinkWithHref);
    expect(routerLink['commands']).toEqual(['/chat-component']);
  });

  //  Should navigate to ConfigComponent when AddBOT button is clicked
  it('should navigate to ConfigComponent when "AddBOT" button is clicked', async () => {
    const configButton = fixture.debugElement.query(By.css('button[routerLink="/config-component"]'));
    configButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const routerLink = configButton.injector.get(RouterLinkWithHref);
    expect(routerLink['commands']).toEqual(['/config-component']);
  });

  //  Should add script to the document in ngOnInit
  it('should add the script to the document body in ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const scriptElements = document.querySelectorAll('script');
    const addedScript = Array.from(scriptElements).find(script => script.src.includes('livechat-static-de-na1.niceincontact.com'));

    expect(addedScript).toBeTruthy();
    expect(addedScript?.async).toBe(true);
  });

  //  Should remove the script from the document in ngOnDestroy
  it('should remove the script from the document body in ngOnDestroy', () => {
    component.ngOnInit(); // Simulate script addition in ngOnInit
    fixture.detectChanges();

    component.ngOnDestroy(); // Simulate component destruction
    fixture.detectChanges();

    const scriptElements = document.querySelectorAll('script');
    const removedScript = Array.from(scriptElements).find(script => script.src.includes('livechat-static-de-na1.niceincontact.com'));

    expect(removedScript).toBeUndefined(); // The script should be removed
  });
});
