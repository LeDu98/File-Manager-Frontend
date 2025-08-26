import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum ToastSeverity {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface ToastMessage {
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number; // Duration in milliseconds
  sticky?: boolean;
  key?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private messageService: MessageService) {}

  /**
   * Show a success toast message
   */
  showSuccess(summary: string, detail?: string, life: number = 3000): void {
    this.show({
      severity: ToastSeverity.SUCCESS,
      summary,
      detail,
      life
    });
  }

  /**
   * Show an info toast message
   */
  showInfo(summary: string, detail?: string, life: number = 3000): void {
    this.show({
      severity: ToastSeverity.INFO,
      summary,
      detail,
      life
    });
  }

  /**
   * Show a warning toast message
   */
  showWarning(summary: string, detail?: string, life: number = 4000): void {
    this.show({
      severity: ToastSeverity.WARN,
      summary,
      detail,
      life
    });
  }

  /**
   * Show an error toast message
   */
  showError(summary: string, detail?: string, life: number = 5000): void {
    this.show({
      severity: ToastSeverity.ERROR,
      summary,
      detail,
      life
    });
  }

  /**
   * Show a custom toast message
   */
  show(message: ToastMessage): void {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life || 3000,
      sticky: message.sticky || false,
      key: message.key
    });
  }

  /**
   * Clear all toast messages
   */
  clear(key?: string): void {
    this.messageService.clear(key);
  }

  /**
   * Show multiple toast messages
   */
  showMultiple(messages: ToastMessage[]): void {
    messages.forEach(message => this.show(message));
  }

  /**
   * Show a sticky toast that doesn't auto-hide
   */
  showSticky(severity: ToastSeverity, summary: string, detail?: string): void {
    this.show({
      severity,
      summary,
      detail,
      sticky: true
    });
  }
}
