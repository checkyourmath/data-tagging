import { InjectionToken } from '@angular/core';
import { TProductsSearchQuery } from '../types/products-search-query.type';
import { Observable } from 'rxjs';
import { TProduct } from '../types/product.type';
import { TSequentialResults } from '../types/sequential-results.type';

export const PRODUCTS_SERVICE = new InjectionToken<IProductsService>(
  'PRODUCTS_SERVICE'
);

export interface IProductsService {
  search(query: TProductsSearchQuery, lastId: string): Observable<TSequentialResults<TProduct>>;
}
