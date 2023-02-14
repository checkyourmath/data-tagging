import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import {
  LoadMoreProducts,
  SelectProduct,
  SetProductsSearchQuery,
  UnselectProduct
} from '../../state/data-tagging.actions';
import { DataTaggingState } from '../../state/data-tagging.state';
import { TProductsSearchState } from '../../types/products-search-state.type';
import { TProduct } from '../../types/product.type';

const SEARCH_INPUT_DEBOUNCE_TIME = 1500;

@UntilDestroy()
@Component({
  selector: 'dt-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSelectorComponent implements OnInit {

  @Select(DataTaggingState.productsSearch)
  public searchState$: Observable<TProductsSearchState>;
  @Select(DataTaggingState.selectedProduct)
  public selectedProduct$: Observable<TProduct>;
  public searchState: TProductsSearchState = null;
  public selectedProduct: TProduct = null;
  public searchControl: FormControl<string>;

  public get products(): TProduct[] {
    return this.searchState?.data || [];
  }

  public get isLoading(): boolean {
    return this.searchState?.isLoading || false;
  }

  public get isSpinnerVisible(): boolean {
    return (
      this.searchState?.isLoading
      || !!this.searchState?.lastId
      || false
    );
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.searchControl = this.formBuilder.control<string>('');
  }

  public ngOnInit(): void {
    this.subscribeToControls();
    this.subscribeToStore();

    this.store.dispatch(new SetProductsSearchQuery({
      query: {
        brandName: ''
      }
    }))
  }

  public selectProduct(product: TProduct): void {
    this.store.dispatch(new SelectProduct({ product }));
  }

  public unselectProduct(product: TProduct): void {
    this.store.dispatch(new UnselectProduct({ product }));
  }

  public onSpinnerVisible(): void {
    if (this.isLoading) {
      return;
    }

    this.store.dispatch(new LoadMoreProducts());
  }

  private subscribeToControls(): void {
    this.searchControl.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(SEARCH_INPUT_DEBOUNCE_TIME),
      distinctUntilChanged(),
    ).subscribe({
      next: (searchValue) => {
        this.store.dispatch(new SetProductsSearchQuery({
          query: {
            brandName: searchValue
          }
        }))
      }
    });
  }

  private subscribeToStore(): void {
    this.searchState$.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (productsSearchState) => {
        this.searchState = productsSearchState;

        this.changeDetectorRef.markForCheck();
      }
    });

    this.selectedProduct$.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProduct) => {
        this.selectedProduct = selectedProduct;

        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
