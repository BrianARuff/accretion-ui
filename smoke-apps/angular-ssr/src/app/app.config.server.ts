import { provideServerRendering } from '@angular/ssr';
import type { ApplicationConfig } from '@angular/core';

export const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};
