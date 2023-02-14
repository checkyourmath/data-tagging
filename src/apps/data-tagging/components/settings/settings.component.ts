import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SetProductsSearchQuery, SetSetting } from '../../state/data-tagging.actions';

@UntilDestroy()
@Component({
  selector: 'dt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  public numberOfImagesControl: FormControl<string>;
  public zoomLevelControl: FormControl<string>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.numberOfImagesControl = this.formBuilder.control<string>('1');
    this.zoomLevelControl = this.formBuilder.control<string>('2.0');
  }

  public ngOnInit(): void {
    this.subscribeToControls();
  }

  private subscribeToControls(): void {
    this.numberOfImagesControl.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe({
      next: (numberOfImages) => {
        this.store.dispatch(new SetSetting({
          numberOfImages: parseInt(numberOfImages, 10),
        }));
      }
    });

    this.zoomLevelControl.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe({
      next: (zoomLevel) => {
        this.store.dispatch(new SetSetting({
          zoomLevel: parseFloat(zoomLevel),
        }));
      }
    });
  }

}
