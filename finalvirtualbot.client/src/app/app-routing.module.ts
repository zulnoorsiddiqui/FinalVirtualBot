import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ConfigComponent } from './config/config.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'

const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'config', component: ConfigComponent },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }, // Redirect to the chat page by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
    // <-- Set up the routes
  exports: [RouterModule]                   // <-- Export RouterModule
})
export class AppRoutingModule { }
