import { TLog } from './log.type';
import { TProductsSearchState } from './products-search-state.type';
import { TProduct } from './product.type';
import { TSettings } from './settings.type';
import { TImagesState } from './images-state.type';

export type TDataTaggingState = {
  logs: TLog[];
  productsSearch: TProductsSearchState;
  selectedProduct: TProduct;
  settings: TSettings;
  images: TImagesState;
}
