import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './components/app/app.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { DataTaggingState } from './state/data-tagging.state';

@NgModule({
  imports: [
    BrowserModule,
    NgxsModule.forRoot([DataTaggingState]),
  ],
  declarations: [
    AppComponent,
    TerminalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class DataTaggingModule { }
