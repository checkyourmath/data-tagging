import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetProductsSearchQuery } from '../../state/data-tagging.actions';
import { DataTaggingState } from '../../state/data-tagging.state';
import { TProductsSearchState } from '../../types/products-search-state.type';
import { TProduct } from '../../types/product.type';

const SEARCH_INPUT_DEBOUNCE_TIME = 1500;

@UntilDestroy()
@Component({
  selector: 'dt-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSelectorComponent implements OnInit {

  @Select(DataTaggingState.productsSearch)
  public searchState$: Observable<TProductsSearchState>;
  public searchState: TProductsSearchState = null;
  public searchControl: FormControl<string>;

  public get isLoading(): boolean {
    return this.searchState?.isLoading;
  }

  public get products(): TProduct[] {
    return this.searchState?.data || [];
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.searchControl = this.formBuilder.control('');
  }

  public ngOnInit(): void {
    this.subscribeToControls();
    this.subscribeToStore();
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
    })
  }
}
