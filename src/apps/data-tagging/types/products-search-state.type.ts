import { TProductsSearchQuery } from './products-search-query.type';
import { TProduct } from './product.type';

export type TProductsSearchState = {
  query: TProductsSearchQuery,
  data: TProduct[],
  lastId: string;
  isLoading: boolean;
  error: Error;
}
