import { TProductsSearchQuery } from '../types/products-search-query.type';
import { TProduct } from '../types/product.type';
import { TSettings } from '../types/settings.type';
import { TImage } from '../types/image.type';

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

export class SetSetting {
  public static readonly type = `${PREFIX} Set Setting`;
  constructor(public params: Partial<TSettings>) {}
}

export class LoadImages {
  public static readonly type = `${PREFIX} Load Images`;
  constructor(public params?: { force?: boolean }) {}
}


export class SubmitImage {
  public static readonly type = `${PREFIX} Submit Image`;
  constructor(public params: { image: TImage }) {}
}
