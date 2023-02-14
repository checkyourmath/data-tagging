import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, Subscription } from 'rxjs';
import {
  AddLog, MarkerAdd, LoadImages,
  LoadMoreProducts, MarkerRemove,
  SelectProduct,
  SetProductsSearchQuery, SetSetting, SubmitImage,
  UnselectProduct, MarkerAssignProduct
} from './data-tagging.actions';
import { TDataTaggingState } from '../types/dta-tagging-state.type';
import { TLog } from '../types/log.type';
import { IProductsService, PRODUCTS_SERVICE } from '../interfaces/products-service.interface';
import { TProductsSearchState } from '../types/products-search-state.type';
import { TProduct } from '../types/product.type';
import { TSettings } from '../types/settings.type';
import { TImagesState } from '../types/images-state.type';
import { IImagesService, IMAGES_SERVICE } from '../interfaces/images-service.interface';
import { TImage } from '../types/image.type';
import { TMarker } from '../types/marker.tpe';

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
    selectedProduct: null,
    settings: {
      numberOfImages: 1,
      previewBeforeSubmit: false,
      zoomLevel: 2.0
    },
    images: {
      isLoading: false,
      data: [],
      error: null,
    },
  }
})
@Injectable()
@UntilDestroy()
export class DataTaggingState {

  private searchRequestSubscription: Subscription = null;
  private imagesRequestSubscription: Subscription = null;
  private nextMarkerId = 1;

  constructor(
    private store: Store,
    @Inject(PRODUCTS_SERVICE)
    private productsService: IProductsService,
    @Inject(IMAGES_SERVICE)
    private imagesService: IImagesService,
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

  @Selector()
  public static settings(state: TDataTaggingState): TSettings {
    return state.settings;
  }

  @Selector()
  public static imagesState(state: TDataTaggingState): TImagesState {
    return state.images;
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
          const products = result.data || [];

          this.store.dispatch(new AddLog({
            message: `Loaded ${products.length} products.`
          }));

          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              data: products,
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
          const moreProducts = result.data || [];

          this.store.dispatch(new AddLog({
            message: `Loaded ${moreProducts.length} more products.`
          }));

          ctx.setState(patch({
            productsSearch: patch<TProductsSearchState>({
              data: [ ...data, ...moreProducts],
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

  @Action(SetSetting)
  public setSetting(ctx: StateContext<TDataTaggingState>, action: SetSetting): void {
    ctx.setState(patch({
      settings: patch({
        ...action.params,
      })
    }));

    const currentState = ctx.getState();
    const { settings: { numberOfImages }, images: { data } } = currentState;

    if (numberOfImages < data.length) {
      ctx.setState(patch({
        images: patch<TImagesState>({
          data: data.slice(0, numberOfImages),
        })
      }));
    }

    if (numberOfImages > data.length) {
      this.store.dispatch(new LoadImages());
    }
  }

  @Action(LoadImages)
  public loadImages(ctx: StateContext<TDataTaggingState>, action: LoadImages): void {
    const currentState = ctx.getState();
    const { settings: { numberOfImages }, images: { data } } = currentState;

    this.abortImagesRequest();

    if (data.length >= numberOfImages && !action.params?.force) {
      return;
    }

    let loadNumberOfImages: number;

    if (action.params?.force) {
      loadNumberOfImages = numberOfImages;

      ctx.setState(patch({
        images: patch<TImagesState>({
          isLoading: true,
          data: [],
          error: null,
        })
      }));
    } else {
      loadNumberOfImages = numberOfImages - data.length;

      ctx.setState(patch({
        images: patch<TImagesState>({
          isLoading: true,
          error: null,
        })
      }));
    }

    this.imagesService.loadNextImages(loadNumberOfImages)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          ctx.setState(patch({
            images: patch<TImagesState>({
              isLoading: false,
            })
          }));
        })
      )
      .subscribe({
        next: (result) => {
          const images = (result || []).map(image => ({
            ...image,
            markers: [],
            isLoading: false,
            isSubmitting: false
          }));

          this.store.dispatch(new AddLog({
            message: `Loaded ${images.length} image(s) data.`
          }));

          if (action.params?.force) {
            ctx.setState(patch({
              images: patch<TImagesState>({
                data: [
                  ...images
                ],
              })
            }));
          } else {
            ctx.setState(patch({
              images: patch<TImagesState>({
                data: [
                  ...data,
                  ...images
                ],
              })
            }));
          }
        },
        error: (error) => {
          ctx.setState(patch({
            images: patch<TImagesState>({
              data: [],
              error: error,
            })
          }));
        }
      });
  }

  @Action(SubmitImage)
  public submitImage(ctx: StateContext<TDataTaggingState>, action: SubmitImage): void {
      const currentState = ctx.getState();
      const { images: { data, isLoading } } = currentState;

    if (isLoading) {
      return;
    }

    const imageIndex = data.findIndex((image) => {
      return image.id === action.params.image.id;
    });

    if (imageIndex < 0) {
      return;
    }

    ctx.setState(patch({
      images: patch<TImagesState>({
        data: updateItem<TImage>(
          (item) => item.id === action.params.image.id,
          patch<TImage>({
            isSubmitting: true
          })
        )
      })
    }));

    const image = data[imageIndex];

    this.imagesService.submitImage(image)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          const currentNewState = ctx.getState();
          const currentImageIndex = currentNewState.images.data.findIndex((image) => {
            return image.id === action.params.image.id;
          });

          if (currentImageIndex < 0) {
            return;
          }

          const [ image ] = currentNewState.images.data.splice(currentImageIndex, 1);

          this.store.dispatch(new AddLog({
            message: `Submitted image markers: ${JSON.stringify(image.markers)}`
          }))

          ctx.setState(patch({
            images: patch<TImagesState>({
              data: [ ...currentNewState.images.data ]
            })
          }));

          this.store.dispatch(new LoadImages());
        }
      });
  }

  @Action(MarkerAdd)
  public markerAdd(ctx: StateContext<TDataTaggingState>, action: MarkerAdd): void {
    const currentState = ctx.getState();
    const { selectedProduct } = currentState;

    const marker: TMarker = {
      id: this.nextMarkerId++,
      x: action.params.x,
      y: action.params.y,
      product_code: selectedProduct?.product_code || null
    };

    ctx.setState(patch({
      images: patch<TImagesState>({
        data: updateItem<TImage>(
          (item) => item.id === action.params.image.id,
          (existing) => ({
            ...existing,
            markers: [ ...existing.markers, marker ]
          })
        )
      })
    }));
  }

  @Action(MarkerRemove)
  public markerRemove(ctx: StateContext<TDataTaggingState>, action: MarkerRemove): void {
    const currentState = ctx.getState();
    const { images: { data } } = currentState;
    const image = data.find(item => item.id === action.params.image.id);

    if (!image) {
      return;
    }

    const markerIndex = image.markers.findIndex(item => item.id === action.params.marker.id);

    if (markerIndex < 0) {
      return;
    }

    image.markers.splice(markerIndex, 1);

    const newMarkers = [ ...image.markers ];

    ctx.setState(patch({
      images: patch<TImagesState>({
        data: updateItem<TImage>(
          (item) => item.id === action.params.image.id,
          (existing) => ({
            ...existing,
            markers: newMarkers
          })
        )
      })
    }));
  }

  @Action(MarkerAssignProduct)
  public markerAssignProduct(ctx: StateContext<TDataTaggingState>, action: MarkerAssignProduct): void {
    const currentState = ctx.getState();
    const { selectedProduct, images: { data } } = currentState;

    const image = data.find(item => item.id === action.params.image.id);

    if (!image) {
      return;
    }

    const markerIndex = image.markers.findIndex(item => item.id === action.params.marker.id);

    if (markerIndex < 0) {
      return;
    }

    image.markers[markerIndex] = {
      ...image.markers[markerIndex],
      product_code: selectedProduct?.product_code || null,
    }

    const newMarkers = [ ...image.markers ];

    ctx.setState(patch({
      images: patch<TImagesState>({
        data: updateItem<TImage>(
          (item) => item.id === action.params.image.id,
          (existing) => ({
            ...existing,
            markers: newMarkers
          })
        )
      })
    }));
  }

  private abortProductsSearchRequest(): void {
    if (!this.searchRequestSubscription) {
      return;
    }

    this.searchRequestSubscription.unsubscribe();
    this.searchRequestSubscription = null;
  }

  private abortImagesRequest(): void {
    if (!this.imagesRequestSubscription) {
      return;
    }

    this.imagesRequestSubscription.unsubscribe();
    this.imagesRequestSubscription = null;
  }
}
