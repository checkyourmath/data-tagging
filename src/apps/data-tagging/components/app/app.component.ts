import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { AddLog } from '../../state/data-tagging.actions';

@Component({
  selector: 'dt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store
  ) {
  }


  public ngOnInit() {
    this.store.dispatch(new AddLog({
      message: 'AppComponent initialized',
    }));
  }

}
