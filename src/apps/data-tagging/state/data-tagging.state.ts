import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, Subscription } from 'rxjs';
import {
  AddLog,
  LoadMoreProducts,
  SelectProduct,
  SetProductsSearchQuery,
  UnselectProduct
} from './data-tagging.actions';
import { TDataTaggingState } from '../types/dta-tagging-state.type';
import { TLog } from '../types/log.type';
import { IProductsService, PRODUCTS_SERVICE } from '../interfaces/products-service.interface';
import { TProductsSearchState } from '../types/products-search-state.type';
import { TProduct } from '../types/product.type';

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
    },
    selectedProduct: null
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

  @Selector()
  public static selectedProduct(state: TDataTaggingState): TProduct {
    return state.selectedProduct;
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
      productsSearch: patch<TProductsSearchState>({
        query: action.params.query,
        isLoading: true,
        data: [],
        error: null,
        lastId: null,
      })
    }));

    this.searchRequestSubscription = this.productsService.search(action.params.query, null)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              isLoading: false,
            })
          }));
        })
      )
      .subscribe({
        next: (result) => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
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

  @Action(LoadMoreProducts)
  public loadMoreProducts(
    ctx: StateContext<TDataTaggingState>,
    action: LoadMoreProducts
  ): void {
    const currentState = ctx.getState();
    const { productsSearch: { isLoading, lastId, query, data } } = currentState;

    if (isLoading || !lastId) {
      return;
    }

    ctx.setState(patch({
      productsSearch: patch<TProductsSearchState>({
        isLoading: true,
        error: null,
        lastId: null,
      })
    }));

    this.searchRequestSubscription = this.productsService.search(query, lastId)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              isLoading: false,
            })
          }));
        })
      )
      .subscribe({
        next: (result) => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              data: [ ...data, ...result.data],
              lastId: result.lastId
            })
          }));
        },
        error: (error) => {
          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              lastId: null,
              error: error,
            })
          }));
        }
      });
  }

  @Action(SelectProduct)
  public selectProduct(
    ctx: StateContext<TDataTaggingState>,
    action: SelectProduct
  ): void {
    ctx.patchState({
      selectedProduct: action.params.product,
    });
  }

  @Action(UnselectProduct)
  public unselectProduct(
    ctx: StateContext<TDataTaggingState>,
    action: UnselectProduct
  ): void {
    const currentState = ctx.getState();
    const { selectedProduct } = currentState;

    if (selectedProduct?._id === action.params.product?._id) {
      ctx.patchState({
        selectedProduct: null,
      });
    }
  }

  private abortProductsSearchRequest(): void {
    if (!this.searchRequestSubscription) {
      return;
    }

    this.searchRequestSubscription.unsubscribe();
    this.searchRequestSubscription = null;
  }


}
