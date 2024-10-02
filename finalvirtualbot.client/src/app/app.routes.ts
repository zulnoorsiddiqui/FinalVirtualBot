import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ConfigComponent } from './config/config.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BotDetailsComponent } from './bot-details/bot-details.component'; // Import the new component

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login-register',
        pathMatch: 'full'
    },
    {
        path: 'login-register',
        component: LoginRegisterComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'config-component',
                component: ConfigComponent // Update to match the path in your HTML
            },
            {
                path: 'bot-details/:id',
                component: BotDetailsComponent // Add route for bot details
            }
        ]
    },
    {
        path: 'chat-component',
        component: ChatComponent
    },
    // Remove if not needed, as 'config-component' might be replaced by 'config'
    // { path: 'config-component', component: ConfigComponent },
];
