import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TProduct } from '../../types/product.type';

const DEFAULT_PRODUCT_NAME = 'unknown';
const DEFAULT_BRAND_NAME = 'unknown';
const DEFAULT_PRODUCT_IMAGE = '/apps/data-tagging/assets/img/question.png';

@UntilDestroy()
@Component({
  selector: 'dt-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  @Input()
  public product: TProduct;

  @Input()
  public selected: boolean;

  @Output()
  public select = new EventEmitter<TProduct>();

  @Output()
  public unselect = new EventEmitter<TProduct>();

  public get productName(): string {
    return this.product?.product_name || DEFAULT_PRODUCT_NAME;
  }

  public get brandName(): string {
    return this.product?.brand_name || DEFAULT_BRAND_NAME;
  }

  public get imageSrc(): string {
    return this.product?.image_url || DEFAULT_PRODUCT_IMAGE;
  }

  public onClick(): void {
    if (this.selected) {
      this.unselect.emit(this.product);
    } else {
      this.select.emit(this.product);
    }
  }
}
