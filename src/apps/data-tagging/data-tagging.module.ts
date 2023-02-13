import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';

import { DataTaggingState } from './state/data-tagging.state';
import { AppComponent } from './components/app/app.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { ItemSelectorComponent } from './components/item-selector/item-selector.component';
import { PRODUCTS_SERVICE } from './interfaces/products-service.interface';
import { ProductsHttpService } from './services/products-http.service';

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
    ItemSelectorComponent
  ],
  providers: [
    {
      provide: PRODUCTS_SERVICE,
      useClass: ProductsHttpService
    }
  ],
  bootstrap: [AppComponent]
})
export class DataTaggingModule { }
