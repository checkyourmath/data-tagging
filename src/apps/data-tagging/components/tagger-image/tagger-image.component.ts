import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TImage } from '../../types/image.type';
import { TMarker } from '../../types/marker.tpe';

@Component({
  selector: 'dt-tagger-image',
  templateUrl: './tagger-image.component.html',
  styleUrls: ['./tagger-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggerImageComponent {
  @Input()
  public image: TImage;

  @Output()
  public submitImage = new EventEmitter<void>();

  @Output()
  public addMarker = new EventEmitter<TMarker>();

  @Output()
  public removeMarker = new EventEmitter<TMarker>();

  public get isSubmitting(): boolean {
    return this.image.isSubmitting;
  }

  public onSubmitClick(): void {
    this.submitImage.emit();
  }
}
