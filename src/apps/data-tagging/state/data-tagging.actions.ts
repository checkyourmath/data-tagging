import { TProductsSearchQuery } from '../types/products-search-query.type';
import { TProduct } from '../types/product.type';

const PREFIX = '[Data Tagging]';

export class AddLog {
  public static readonly type = `${PREFIX} Add Log`;
  constructor(public params: { message: string }) {}
}

export class SetProductsSearchQuery {
  public static readonly type = `${PREFIX} Set Products Search Query`;
  constructor(public params: { query: TProductsSearchQuery }) {}
}

export class LoadMoreProducts {
  public static readonly type = `${PREFIX} Load More Products`;
}

export class SelectProduct {
  public static readonly type = `${PREFIX} Select Product`;
  constructor(public params: { product: TProduct }) {}
}

export class UnselectProduct {
  public static readonly type = `${PREFIX} Unselect Product`;
  constructor(public params: { product: TProduct }) {}
}
