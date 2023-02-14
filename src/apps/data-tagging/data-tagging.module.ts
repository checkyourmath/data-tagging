import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';

import { DataTaggingState } from './state/data-tagging.state';
import { AppComponent } from './components/app/app.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { PRODUCTS_SERVICE } from './interfaces/products-service.interface';
import { ProductsHttpService } from './services/products-http.service';
import { ProductSelectorComponent } from './components/product-selector/product-selector.component';
import { ProductComponent } from './components/product/product.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TaggerComponent } from './components/tagger/tagger.component';
import { IMAGES_SERVICE } from './interfaces/images-service.interface';
import { ImagesMockService } from './services/images-mock.service';
import { TaggerImageComponent } from './components/tagger-image/tagger-image.component';
import { TaggerMarkerComponent } from './components/tagger-marker/tagger-marker.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([DataTaggingState]),
  ],
  declarations: [
    AppComponent,
    TerminalComponent,
    ProductSelectorComponent,
    ProductComponent,
    SpinnerComponent,
    SettingsComponent,
    TaggerComponent,
    TaggerImageComponent,
    TaggerMarkerComponent
  ],
  providers: [
    {
      provide: PRODUCTS_SERVICE,
      useClass: ProductsHttpService
    },
    {
      provide: IMAGES_SERVICE,
      useClass: ImagesMockService
    }
  ],
  bootstrap: [AppComponent]
})
export class DataTaggingModule { }
