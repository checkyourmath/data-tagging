import { TLog } from './log.type';
import { TProductsSearchState } from './products-search-state.type';
import { TProduct } from './product.type';

export type TDataTaggingState = {
  logs: TLog[];
  productsSearch: TProductsSearchState;
  selectedProduct: TProduct;
}
