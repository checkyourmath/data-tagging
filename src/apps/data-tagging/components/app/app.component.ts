import { Store } from '@ngxs/store';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AddLog } from '../../state/data-tagging.actions';

@Component({
  selector: 'dt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public isHelpVisible = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(new AddLog({
      message: 'AppComponent initialized.',
    }));
  }

  @HostListener('click')
  public onClick() {
    this.isHelpVisible = false;

    this.changeDetectorRef.markForCheck();
  }

  public onSettingsHelp(): void {
    this.isHelpVisible = true;

    this.changeDetectorRef.markForCheck();
  }

  public onHelpClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  public onHelpClose(): void {
    this.isHelpVisible = false;

    this.changeDetectorRef.markForCheck();
  }
}
