import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import Lara from '@primeng/themes/lara';  
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({ theme: { preset: Lara }, ripple: true }),
    provideHttpClient(withInterceptorsFromDi()),
    MessageService
  ]
};
