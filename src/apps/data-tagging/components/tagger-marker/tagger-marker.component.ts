import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TMarker } from '../../types/marker.tpe';

const DEFAULT_WIDTH = 14;
const DEFAULT_HEIGHT = 14;

@Component({
  selector: 'dt-tagger-marker',
  templateUrl: './tagger-marker.component.html',
  styleUrls: ['./tagger-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggerMarkerComponent {
  @Input()
  public marker: TMarker;
  @Input()
  public zoomLevel = 1;
  @Input()
  public imageOffsetLeft: number;
  @Input()
  public imageOffsetTop: number;
  @Input()
  public imageOffsetWidth: number;
  @Input()
  public imageOffsetHeight: number;
  @Input()
  public imageNaturalWidth: number;
  @Input()
  public imageNaturalHeight: number;


  @Output()
  public assignProduct = new EventEmitter<void>();
  @Output()
  public remove = new EventEmitter<void>();

  public get hasProduct(): boolean {
    return !!this.marker.product_code;
  }

  public get width(): number {
    return this.zoomLevel * DEFAULT_WIDTH;
  }

  public get height(): number {
    return this.zoomLevel * DEFAULT_HEIGHT;
  }

  public get top(): number {
    return this.imageOffsetTop + this.marker.y * this.imageOffsetHeight / this.imageNaturalHeight;
  }

  public get left(): number {
    return this.imageOffsetLeft + this.marker.x * this.imageOffsetWidth / this.imageNaturalWidth;
  }

  public onClick(): void {
    this.assignProduct.emit();
  }

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.remove.emit();
  }
}
