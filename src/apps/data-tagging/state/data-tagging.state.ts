import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, Subscription } from 'rxjs';
import { TDataTaggingState } from '../types/dta-tagging-state.type';
import { AddLog, SetProductsSearchQuery } from './data-tagging.actions';
import { TLog } from '../types/log.type';
import { IProductsService, PRODUCTS_SERVICE } from '../interfaces/products-service.interface';
import { TProductsSearchState } from '../types/products-search-state.type';

@State<TDataTaggingState>({
  name: 'DataTagging',
  defaults: {
    logs: [],
    productsSearch: {
      query: {
        brandName: ''
      },
      data: [],
      lastId: null,
      isLoading: false,
      error: null
    }
  }
})
@Injectable()
@UntilDestroy()
export class DataTaggingState {

  private searchRequestSubscription: Subscription = null;

  constructor(
    private store: Store,
    @Inject(PRODUCTS_SERVICE)
    private productsService: IProductsService,
  ) {
  }

  @Selector()
  public static logs(state: TDataTaggingState): TLog[] {
    return state.logs;
  }

  @Selector()
  public static productsSearch(state: TDataTaggingState): TProductsSearchState {
    return state.productsSearch;
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

  @Action(SetProductsSearchQuery)
  public setProductsSearchQuery(
    ctx: StateContext<TDataTaggingState>,
    action: SetProductsSearchQuery
  ): void {
    this.abortProductsSearchRequest();

    ctx.setState(patch({
      productsSearch: patch({
        query: action.params.query,
        isLoading: true,
        error: null,
      })
    }));

    this.searchRequestSubscription = this.productsService.search(action.params.query, null)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          ctx.setState(patch({
            productsSearch: patch({
              isLoading: false,
            })
          }));
        })
      )
      .subscribe({
        next: (result) => {
          ctx.setState(patch({
            productsSearch: patch({
              data: result.data,
              lastId: result.lastId
            })
          }));
        },
        error: (error) => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              data: [],
              lastId: null,
              error: error,
            })
          }));
        }
      });
  }

  private abortProductsSearchRequest(): void {
    if (!this.searchRequestSubscription) {
      return;
    }

    this.searchRequestSubscription.unsubscribe();
    this.searchRequestSubscription = null;
  }


}
