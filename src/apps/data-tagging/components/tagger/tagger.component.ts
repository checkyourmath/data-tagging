import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { DataTaggingState } from '../../state/data-tagging.state';
import { TSettings } from '../../types/settings.type';
import { LoadImages, SubmitImage } from '../../state/data-tagging.actions';
import { TImagesState } from '../../types/images-state.type';
import { TImage } from '../../types/image.type';

@UntilDestroy()
@Component({
  selector: 'dt-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggerComponent implements OnInit {
  @Select(DataTaggingState.settings)
  public settings$: Observable<TSettings>;
  @Select(DataTaggingState.imagesState)
  public imagesState$: Observable<TImagesState>;
  public settings: TSettings = null;
  public imagesState: TImagesState = null;


  public get isLoading(): boolean {
    return this.imagesState.isLoading;
  }

  public get images(): TImage[] {
    return this.imagesState.data;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store,
  ) {
  }

  public ngOnInit(): void {
    this.subscribeToStore();

    this.store.dispatch(new LoadImages());
  }

  public onLoadNextImagesClick(): void {
    this.store.dispatch(new LoadImages({
      force: true,
    }))
  }

  public onSubmitImage(image: TImage) {
    this.store.dispatch(new SubmitImage({ image }));
  }

  private subscribeToStore(): void {
    this.settings$.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (settings) => {
        this.settings = settings;

        this.changeDetectorRef.markForCheck();
      }
    });

    this.imagesState$.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (imagesState) => {
        this.imagesState = imagesState;

        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
