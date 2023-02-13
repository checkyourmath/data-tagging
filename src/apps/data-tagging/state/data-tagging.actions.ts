import { TProductsSearchQuery } from '../types/products-search-query.type';

const PREFIX = '[Data Tagging]';

export class AddLog {
  public static readonly type = `${PREFIX} Add Log`;
  constructor(public params: { message: string }) {}
}

export class SetProductsSearchQuery {
  public static readonly type = `${PREFIX} Set Products Search Query`;
  constructor(public params: { query: TProductsSearchQuery }) {}
}
