import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DataTaggingModule } from './apps/data-tagging/data-tagging.module';

platformBrowserDynamic().bootstrapModule(DataTaggingModule)
  .catch(err => console.error(err));
