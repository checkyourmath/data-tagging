import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DataTaggingState } from '../../state/data-tagging.state';
import { TLog } from '../../types/log.type';

@Component({
  selector: 'dt-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent {

  @Select(DataTaggingState.logs)
  public logs$: Observable<TLog[]>;
}
