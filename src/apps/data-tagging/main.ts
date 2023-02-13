import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DataTaggingModule } from './data-tagging.module';

platformBrowserDynamic().bootstrapModule(DataTaggingModule)
  .catch(err => console.error(err));
