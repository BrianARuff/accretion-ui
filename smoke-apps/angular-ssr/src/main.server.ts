import { mergeApplicationConfig } from '@angular/core';
import {
  type BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { serverConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(
    AppComponent,
    mergeApplicationConfig(appConfig, serverConfig),
    context,
  );

export default bootstrap;
