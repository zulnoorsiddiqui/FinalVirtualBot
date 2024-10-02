import { Component, OnInit } from '@angular/core';
import { BotConfigService } from '../config-services/bot-config.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  botProvider: string = '';
  appName: string = '';
  configVersion: string = '';
  JsonServiceAccount: string = '';
  Region: string = '';
  Language: string = '';

  historyList: Array<{ id: string, botName: string, provider: string }> = []; // Include id in historyList

  constructor(private botConfigService: BotConfigService, private router: Router) {}

  ngOnInit() {
    this.loadBotConfigs();
  }

  saveConfig() {
    if (this.isFormValid()) {
      const newConfig = {
        botName: this.appName,
        provider: this.botProvider,
        configVersion: this.configVersion,
        jsonServiceAccount: this.JsonServiceAccount,
        region: this.Region,
        language: this.Language,
      };

      this.botConfigService.createBotConfig(newConfig).subscribe({
        next: (response) => {
          console.log('Configuration saved successfully:', response);
          this.loadBotConfigs();  // Reload configs after saving
          this.resetForm();
        },
        error: (error) => {
          console.error('Error saving configuration:', error);
          alert('Failed to save the configuration.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  loadBotConfigs() {
    this.botConfigService.getAllBotConfigs().subscribe({
      next: (response: any[]) => {
        this.historyList = response.map(item => ({
          id: item.id,  // Add id to the historyList
          botName: item.botName,
          provider: item.provider
        }));
      },
      error: (error) => {
        console.error('Error loading configurations:', error);
        alert('Failed to load bot configurations.');
      }
    });
  }

  isFormValid(): boolean {
    return !!this.botProvider && !!this.appName && !!this.configVersion && !!this.JsonServiceAccount && !!this.Region && !!this.Language;
  }

  resetForm() {
    this.botProvider = '';
    this.appName = '';
    this.configVersion = '';
    this.JsonServiceAccount = '';
    this.Region = '';
    this.Language = '';
  }
  deleteConfig(configId: string): void {
    if (confirm('Are you sure you want to delete this configuration?')) {
      this.botConfigService.deleteBotConfig(configId).subscribe({
        next: () => {
          console.log('Configuration deleted:', configId);
          // Update the history list to remove the deleted config
          this.historyList = this.historyList.filter(config => config.id !== configId);
        },
        error: (error) => {
          console.error('Error deleting configuration:', error);
          alert('Failed to delete the configuration.');
        }
      });
    }
}
}
