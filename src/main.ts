import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

//Disable console log in prod
if (environment.production) {
  enableProdMode();
  window.console.log = () => { };
  window.console.error = () => { };
  window.console.warn = () => { };
  window.console.info = () => { };
  window.console.debug = () => { };
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
