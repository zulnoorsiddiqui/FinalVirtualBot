import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BotConfigService } from '../config-services/bot-config.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bot-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bot-details.component.html',
  styleUrls: ['./bot-details.component.css'] // Corrected styleUrl to styleUrls
})
export class BotDetailsComponent implements OnInit {
  botConfig: any = {
    botName: '',
    provider: '',
    configVersion: '',
    jsonServiceAccount: '',
    region: '',
    language: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private botConfigService: BotConfigService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBotConfig(id);
    }
  }

  loadBotConfig(id: string): void {
    console.log('Fetching bot config for ID:', id); // Log the ID being used
    this.botConfigService.getBotConfigById(id).subscribe({
      next: (data) => {
        this.botConfig = data;
      },
      error: (error: any) => {
        console.error('Error fetching bot configuration:', error);
       // alert('Failed to load bot configuration. Please check if the bot exists.');
      }
    });
  }

  saveConfig(): void {
    this.botConfigService.updateBotConfig(this.botConfig.id, this.botConfig).subscribe({
      next: () => {
        console.log('Configuration updated successfully.'); // Changed to console.log
        this.router.navigate(['/config-component']); // Redirect to the config page
      },
      error: (error) => {
        console.error('Error updating configuration:', error);
       // alert('Failed to update the configuration. Please try again.'); // Alert user
      }
    });
  }

  cancel(): void {
    this.router.navigate(['config-component']); // Redirect to the config page
  }

  navigateToChat() {
    this.router.navigate(['/chat-component']);
  }

  Back() {
    this.router.navigate(['/config-component']);
  }
}
