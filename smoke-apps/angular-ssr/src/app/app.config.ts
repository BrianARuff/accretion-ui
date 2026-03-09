import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import type { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(), provideRouter(routes)],
};
