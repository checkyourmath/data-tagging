import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { TDataTaggingState } from '../types/dta-tagging-state.type';
import { AddLog } from './data-tagging.actions';
import { TLog } from '../types/log.type';

@State<TDataTaggingState>({
  name: 'DataTagging',
  defaults: {
    logs: [],
  }
})
@Injectable()
export class DataTaggingState {

  constructor(
    private store: Store,
  ) {
  }

  @Selector()
  public static logs(state: TDataTaggingState): TLog[] {
    return state.logs;
  }

  @Action(AddLog)
  public addLog(ctx: StateContext<TDataTaggingState>, action: AddLog): void {
    const currentState = ctx.getState();
    const { logs } = currentState;
    const { message } = action.params;

    ctx.patchState({
      logs: [
        {
          message,
          time: new Date(),
        },
        ...logs
      ]
    });
  }

}
