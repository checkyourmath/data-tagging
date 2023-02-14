import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output, ViewChild
} from '@angular/core';
import { TImage } from '../../types/image.type';
import { TMarker } from '../../types/marker.tpe';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'dt-tagger-image',
  templateUrl: './tagger-image.component.html',
  styleUrls: ['./tagger-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggerImageComponent implements AfterViewInit {

  @Input()
  public image: TImage;

  @Input()
  public zoomLevel: number;

  @Output()
  public submitImage = new EventEmitter<void>();

  @Output()
  public addMarker = new EventEmitter<{ x: number; y: number; }>();

  @Output()
  public removeMarker = new EventEmitter<TMarker>();

  @ViewChild('imageElement')
  public imageElement: ElementRef<HTMLImageElement>;

  @ViewChild('zoomArea')
  public zoomArea: ElementRef<HTMLDivElement>;
  @ViewChild('zoomedImage')
  public zoomedImage: ElementRef<HTMLDivElement>;

  public isImageLoading = true;
  public isHovering = false;
  public zoomAreaWidth = 160;
  public zoomAreaHeight = 160;
  public zoomedImageWidth: number;
  public zoomedImageHeight: number;
  public zoomedImageTop: number;
  public zoomedImageLeft: number;


  public get isSubmitting(): boolean {
    return this.image.isSubmitting;
  }

  public get isZoomAreaVisible(): boolean {
    return this.zoomLevel > 1 && this.isHovering;
  }

  public get markers(): TMarker[] {
    return this.image.markers;
  }

  public get imageOffsetLeft(): number {
    return this.imageElement?.nativeElement.offsetLeft;
  }

  public get imageOffsetTop(): number {
    return this.imageElement?.nativeElement.offsetTop;
  }

  public get imageOffsetWidth(): number {
    return this.imageElement?.nativeElement.offsetWidth;
  }

  public get imageOffsetHeight(): number {
    return this.imageElement?.nativeElement.offsetHeight;
  }

  public get imageNaturalWidth(): number {
    return this.imageElement?.nativeElement.naturalWidth;
  }

  public get imageNaturalHeight(): number {
    return this.imageElement?.nativeElement.naturalHeight;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngAfterViewInit() {
    fromEvent(this.imageElement.nativeElement, 'load')
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        console.dir(this.imageElement.nativeElement);

        this.isImageLoading = false;

        this.changeDetectorRef.markForCheck();
      });
  }

  public onSubmitClick(): void {
    this.submitImage.emit();
  }

  public onImageMouseEnter(): void {
    this.isHovering = true;

    this.changeDetectorRef.markForCheck();
  }

  public onImageMouseMove(event: MouseEvent): void {
    if (
      !this.zoomArea?.nativeElement
      || !this.imageElement?.nativeElement
      || !this.zoomedImage?.nativeElement
    ) {
      return;
    }

    const zoomArea = this.zoomArea.nativeElement;
    const zoomedImage = this.zoomedImage.nativeElement;
    const { offsetX, offsetY } = event;
    const imageWidth = this.imageOffsetWidth;
    const imageHeight = this.imageOffsetHeight;
    const imageOffsetTop = this.imageOffsetTop;
    const imageOffsetLeft = this.imageOffsetLeft;
    const zoomAreaTop = imageOffsetTop + offsetY;
    const zoomAreaLeft = imageOffsetLeft + offsetX;
    const zoomedImageWidth = imageWidth * this.zoomLevel;
    const zoomedImageHeight = imageHeight * this.zoomLevel;
    const zoomedImageTop = -1.0 * (offsetY * this.zoomLevel - this.zoomAreaHeight * 0.5);
    const zoomedImageLeft = -1.0 * (offsetX * this.zoomLevel - this.zoomAreaWidth * 0.5);

    zoomArea.style.top = `${zoomAreaTop}px`;
    zoomArea.style.left = `${zoomAreaLeft}px`;
    this.zoomedImageWidth = zoomedImageWidth;
    this.zoomedImageHeight = zoomedImageHeight;
    this.zoomedImageTop = zoomedImageTop;
    this.zoomedImageLeft = zoomedImageLeft;

    this.changeDetectorRef.markForCheck();
  }

  public onImageClick(event: MouseEvent): void {
    if (
      !this.imageElement?.nativeElement
    ) {
      return;
    }

    const { offsetX, offsetY } = event;
    const imageWidth = this.imageOffsetWidth;
    const imageHeight = this.imageOffsetHeight;
    const imageNaturalWidth = this.imageNaturalWidth;
    const imageNaturalHeight = this.imageNaturalHeight;

    this.addMarker.emit({
      x: Math.floor(offsetX * imageNaturalWidth / imageWidth),
      y: Math.floor(offsetY * imageNaturalHeight / imageHeight),
    });
  }

  public onMarkerRemove(marker: TMarker): void {
    this.removeMarker.emit(marker);
  }

  public onImageMouseLeave(): void {
    this.isHovering = false;

    this.changeDetectorRef.markForCheck();
  }
}
