import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { IProductsService } from '../interfaces/products-service.interface';
import { TProduct } from '../types/product.type';
import { TSequentialResults } from '../types/sequential-results.type';
import { TProductsSearchQuery } from '../types/products-search-query.type';

@Injectable({ providedIn: 'root' })
export class ProductsHttpService implements IProductsService {

  private searchUrl = '/api/facings';

  constructor(
    private httpClient: HttpClient,
  ) {
  }
  public search(query: TProductsSearchQuery, lastId: string): Observable<TSequentialResults<TProduct>> {
    const params: { brand_name: string; lastId?: string; } = {
      brand_name: query.brandName,
    }

    if (lastId) {
      params.lastId = lastId;
    }

    return this.httpClient.get<{ data: TProduct[], next: string }>(this.searchUrl, {
      params
    }).pipe(
      map((result) => {
        return {
          data: result.data || [],
          lastId: this.getLastIdFromNext(result.next)
        }
      })
    );
  }

  private getLastIdFromNext(next: string): string {
    if (!next) {
      return null;
    }

    const params = new URLSearchParams(next);

    return params.get('lastId');
  }
}
