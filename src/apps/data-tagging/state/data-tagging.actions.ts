import { TProductsSearchQuery } from '../types/products-search-query.type';
import { TProduct } from '../types/product.type';
import { TSettings } from '../types/settings.type';
import { TImage } from '../types/image.type';
import { TMarker } from '../types/marker.tpe';

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

export class MarkerAdd {
  public static readonly type = `${PREFIX} Marker Add`;
  constructor(public params: { image: TImage; x: number; y: number; }) {}
}

export class MarkerRemove {
  public static readonly type = `${PREFIX} Marker Remove`;
  constructor(public params: { image: TImage; marker: TMarker; }) {}
}

export class MarkerAssignProduct {
  public static readonly type = `${PREFIX} Marker Assign Product`;
  constructor(public params: { image: TImage; marker: TMarker; }) {}
}
