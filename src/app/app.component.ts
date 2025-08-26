import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet, ToastModule]
})

export class AppComponent {
  isSidebarCollapsed = false;

  constructor(private toastService: ToastService) {}

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
